const FS = require('fs');
const Path = require('path');
const OpenAI = require('openai');
const { Command } = require('commander');
const { Loop } = require('@coderich/gameflow');
const Util = require('@coderich/util');
const ConfigClient = require('../src/service/ConfigClient');
const EventEmitter = require('../src/service/EventEmitter');
const AppService = require('../src/service/AppService');

const program = new Command();

program.name('DM').description('Eldermud Dungeon Master');

// Setup
program.hook('preAction', (thisCommand, actionCommand) => {
  global.SYSTEM = new EventEmitter().setMaxListeners(5);
  global.CONFIG = new ConfigClient(`${__dirname}/../src/data`);
  global.CONFIG.merge(ConfigClient.parseFile(`${__dirname}/../src/database.json`));
  global.APP = AppService;
  const { apiKey, dungeonMaster } = CONFIG.get('secrets.openai');
  actionCommand.dungeonMaster = dungeonMaster;
  actionCommand.openai = new OpenAI({ apiKey });
});

// Programs
program.command('train').action(async (thisCommand, actionCommand) => {
  const { openai, dungeonMaster } = actionCommand;

  // Grab all the game content
  const { config } = CONFIG.toObject();
  const { map, creature, weapon, trait, mechanic } = config;
  const content = Util.flatten({ map, creature, weapon, trait, mechanic }, { safe: true });

  // Convert to JSONL format
  const training = [
    JSON.stringify({
      messages: [
        { role: 'system', content: 'You are the Dungeon Master' },
        { role: 'user', content: 'Examine the current game content' },
        {
          role: 'assistant',
          content: `
            You must always examine the current game content carefully to decide what should be reused, created, or updated
            Study and understand existing traits and mechanics because they need to be reused as much as possible
            ${JSON.stringify(content)}
          `,
        },
      ],
    }),
  ].join('\n');

  // Create training file
  const file = await openai.files.create({
    file: await OpenAI.toFile(Buffer.from(training)),
    purpose: 'assistants',
  });

  // Update DM
  await openai.beta.assistants.update(dungeonMaster, {
    name: 'Dungeon Master',
    file_ids: [file.id], // Training file
    tools: [
      { type: 'retrieval' },
      // {
      //   type: 'function',
      //   name: 'gameSuggestion',
      //   description: `
      //     You (the Dungeon Master) can communicate to me (the programmer of this MUD)
      //     any new ideas, mechanics, or data model changes that would greatly increase your ability to generate a more deeply immersive experience for players
      //   `,
      //   parameters: {
      //     sugggestion: { type: 'string', description: 'The Dungeon Masters suggestion to make the game better' },
      //   },
      // },
      {
        type: 'function',
        function: {
          name: 'crudContent',
          description: `
            CRUD Game Content
            The payload sent will be deep merged into existing game content
            To delete content, send a null value for a given property
            Content should be as atomic and sharable as possible
            You must carefully examine the current game content to decide what should be reused, created, updated, or deleted
            To reuse content, create a self-reference to it (eg: "\${self:path.to.content}")
            All self-references must exist (no placeholders); you are free to create ancillary content in order to fully complete a specific task
            Any property containing $key must be replaced with a unique keyname that identifies the word that comes before it
            Any data type "number" must be passed in as a string; it may also be represented as a dice-roll (eg: "2d10+3", "4d10-1")
            Rooms (and their exits) must be organized on a 2d grid and cannot overlap (unless the exit is "u" or "d")
            Rooms are conceptually any size; utilize room name, description, and map layout to portray dimension to the player
            Ensure that all rooms are interconnected (no inaccessible islands)
            Use room.spawns to strategically place creatures on the map; otherwise creatures will never make it into the game
          `,
          parameters: {
            type: 'object',
            properties: {
              'map.$key.name': { type: 'string', description: 'A unique name for this map' },
              'map.$key.description': { type: 'string', description: 'Describe the tone/idea of this area' },
              'map.$key.rooms.$key.name': { type: 'string', description: 'A unique name for this room (titlecase)' },
              'map.$key.rooms.$key.char': { type: 'string', description: 'A single character (used sparingly) to visually mark a special room' },
              'map.$key.rooms.$key.description': { type: 'string', description: 'The room description' },
              'map.$key.rooms.$key.exits.n': { type: 'string', description: 'Define an obvious exit north to another room via ${self:reference} to that room' },
              'map.$key.rooms.$key.exits.s': { type: 'string', description: 'Define an obvious exit south to another room via ${self:reference} to that room' },
              'map.$key.rooms.$key.exits.e': { type: 'string', description: 'Define an obvious exit east to another room via ${self:reference} to that room' },
              'map.$key.rooms.$key.exits.w': { type: 'string', description: 'Define an obvious exit west to another room via ${self:reference} to that room' },
              'map.$key.rooms.$key.exits.ne': { type: 'string', description: 'Define an obvious exit northeast to another room via ${self:reference} to that room' },
              'map.$key.rooms.$key.exits.nw': { type: 'string', description: 'Define an obvious exit northwest to another room via ${self:reference} to that room' },
              'map.$key.rooms.$key.exits.se': { type: 'string', description: 'Define an obvious exit southeast to another room via ${self:reference} to that room' },
              'map.$key.rooms.$key.exits.sw': { type: 'string', description: 'Define an obvious exit southwest to another room via ${self:reference} to that room' },
              'map.$key.rooms.$key.exits.u': { type: 'string', description: 'Define an obvious exit up to another room via ${self:reference} to that room' },
              'map.$key.rooms.$key.exits.d': { type: 'string', description: 'Define an obvious exit down to another room via ${self:reference} to that room' },
              'map.$key.rooms.$key.spawns': {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    num: { type: 'number', description: 'The number of creatures to spawn' },
                    units: { type: 'array', items: { type: 'string' }, description: '${self:references} to the creatures to spawn' },
                  },
                },
                description: 'Creatues will spawn in this room from time to time. The array lets you define multiple groups of creatures (eg. You can have a single boss always spawn along with 2d2+1 lesser creatures)',
              },
              'map.$key.rooms.$key.respawn': { type: 'number', description: 'Specifies the number of seconds creatures will respawn after the room has been cleared' },
              'map.$key.rooms.$key.shop': { type: 'string', description: '${self:reference} to a shop' },

              'class.$key.name': { type: 'string', description: 'The class name' },
              // 'class.$key.visual': { type: 'string', description: 'Visually describe this class' },
              'class.$key.description': { type: 'string', description: 'A character description of this class' },
              'class.$key.str': { type: 'integer', description: 'Strength increases HP, carry weight, and damage' },
              'class.$key.dex': { type: 'integer', description: 'Dexterity increases Armor, speed, and damage' },
              'class.$key.int': { type: 'integer', description: 'Intellect increases Mana, and damage' },
              'class.$key.wis': { type: 'integer', description: 'Wisdom increases Mana, and damage' },
              'class.$key.pri': { type: 'string', enum: ['str', 'dex', 'int', 'wis'], description: 'The class primary stat' },
              'class.$key.talents': { type: 'array', items: { type: 'string' }, description: '${self:references} to talents granted to this class' },
              'class.$key.traits': { type: 'array', items: { type: 'string' }, description: '${self:references} to traits granted to this class' },
              'class.$key.attacks': { type: 'array', items: { type: 'string' }, description: '${self:references} to weapons this class attacks with' },
              'race.$key.name': { type: 'string', description: 'The race name' },
              // 'race.$key.visual': { type: 'string', description: 'Visually describe this race' },
              'race.$key.description': { type: 'string', description: 'A character description of this race' },
              'race.$key.str': { type: 'integer', description: 'Bonus to strength, if any' },
              'race.$key.dex': { type: 'integer', description: 'Bonus to dexterity, if any' },
              'race.$key.int': { type: 'integer', description: 'Bonus to intellect, if any' },
              'race.$key.wis': { type: 'integer', description: 'Bonus to wisdom, if any' },
              'race.$key.talents': { type: 'array', items: { type: 'string' }, description: '${self:references} to talents granted to this race' },
              'race.$key.traits': { type: 'array', items: { type: 'string' }, description: '${self:references} to traits granted to this race' },

              'npc.$key.name': { type: 'string', description: 'The npc name' },
              'npc.$key.visual': { type: 'string', description: 'Visually describe this npc' },
              'npc.$key.description': { type: 'string', description: 'A character description of this npc' },
              'npc.$key.map': { type: 'string', description: '${self:reference} to the map this npc is in' },
              'npc.$key.room': { type: 'string', description: '${self:reference} to the room this npc is in' },
              'npc.$key.talents': { type: 'array', items: { type: 'string' }, description: '${self:references} to talents granted to this npc' },
              'npc.$key.traits': { type: 'array', items: { type: 'string' }, description: '${self:references} to traits granted to this npc' },
              'creature.$key.name': { type: 'string', description: 'The creature name (lowercase unless a boss)' },
              'creature.$key.visual': { type: 'string', description: 'Visually describe this creature' },
              'creature.$key.description': { type: 'string', description: 'A character description of this creature' },
              'creature.$key.str': { type: 'integer', description: 'The creature strength' },
              'creature.$key.dex': { type: 'integer', description: 'The creature dexterity' },
              'creature.$key.int': { type: 'integer', description: 'The creature intellect' },
              'creature.$key.wis': { type: 'integer', description: 'The creature wisdom' },
              'creature.$key.pri': { type: 'string', enum: ['str', 'dex', 'int', 'wis'], description: 'The creature primary stat' },
              'creature.$key.lvl': { type: 'number', description: 'The creature experience level' },
              'creature.$key.exp': { type: 'integer', description: 'The amount of exp awarded when creature is slain' },
              'creature.$key.slain': { type: 'string', description: 'A short description that depicts the creatures death' },
              'creature.$key.rank': { type: 'number', description: 'Indicates this creatures rank. Higher rank will offer more stat bonus. The range of this value must match the length of "ranks" attribute' },
              'creature.$key.ranks': { type: 'array', items: { type: 'string' }, description: 'Individual word (adjectives) that describe a hierarchical ranking among this type of creature. The length of this array must match the range of "rank" value.' },
              'creature.$key.adjectives': { type: 'array', items: { type: 'string' }, description: 'Individual word (adjectives) that add randomness to a particular spawn of this creature (eg: [small, giant, huge, fat, skinny, angry])' },
              'creature.$key.moves': { type: 'array', items: { type: 'string' }, description: 'Individual words that add randomness to how a creature may move (eg: [creep, scuttle, wobble])' },
              'creature.$key.attacks': { type: 'array', items: { type: 'string' }, description: '${self:references} to weapons this creature is capable of attacking with' },
              'creature.$key.talents': { type: 'array', items: { type: 'string' }, description: '${self:references} to talents granted to this creature' },
              'creature.$key.traits': { type: 'array', items: { type: 'string' }, description: '${self:references} to traits granted to this creature' },

              'blockade.$key.name': { type: 'string', description: 'The blockade name' },
              'blockade.$key.label': { type: 'string', description: 'A short label that will prefix the exit it blocks (lowercase)' },
              'blockade.$key.visual': { type: 'string', description: 'Visually describe this blockade' },
              'blockade.$key.requires': { type: 'array', items: { type: 'string' }, description: '${self:references} to all things required to overcome this blockade' },
              'door.$key.name': { type: 'string', description: 'The door name' },
              'door.$key.key': { type: 'string', description: '${self:reference} to the item that will unlock this door' },
              'door.$key.label': { type: 'string', description: 'A short label that will prefix the exit it blocks (lowercase)' },
              'door.$key.status': { type: 'string', enum: ['open', 'closed', 'locked'], description: 'The starting status of the door' },
              'door.$key.durability': { type: 'integer', description: 'Indicates how difficult it would be to smash in' },
              'door.$key.picklock': { type: 'string', description: 'Indicates how difficult it would be to pick the lock' },
              'door.$key.description': { type: 'string', description: 'The door description' },

              'talent.$key.name': { type: 'string', description: 'The talent name' },
              'talent.$key.description': { type: 'string', description: 'The talent description' },
              'trait.$key.name': { type: 'string', description: 'The trait name' },
              'trait.$key.description': { type: 'string', description: 'The trait description' },
              'trait.$key.mechanics': { type: 'array', items: { type: 'string' }, description: '${self:references} to mechanics that define this passive' },
              'mechanic.$key.name': { type: 'string', description: 'The mechanic name' },
              'mechanic.$key.description': { type: 'string', description: 'The mechanic description' },

              'shop.$key.name': { type: 'string', description: 'The shop name' },
              'shop.$key.description': { type: 'string', description: 'The shop description' },
              'shop.$key.items': { type: 'array', items: { type: 'string' }, description: '${self:references} to items sold' },
              'item.$key.name': { type: 'string', description: 'The item name' },
              'item.$key.visual': { type: 'string', description: 'Visually describe this item' },
              'item.$key.description': { type: 'string', description: 'The item description' },
              'weapon.$key.name': { type: 'string', description: 'The weapon name (lowercase unless special)' },
              'weapon.$key.visual': { type: 'string', description: 'Visually describe this weapon' },
              'weapon.$key.description': { type: 'string', description: 'The weapon description' },
              'weapon.$key.dmg': { type: 'number', description: 'The weapon damage' },
              'weapon.$key.range': { type: 'string', enum: ['1', '2', '3'], description: 'The weapon range [frontrank, midrank, backrank]' },
              'weapon.$key.speed': { type: 'integer', description: 'The swing speed of this weapon; higher values are slower' },
              'weapon.$key.hits': { type: 'array', items: { type: 'string' }, description: 'Individual words that add randomness to how this weapon may hit (eg: [scratch, rip, tear])' },
              'weapon.$key.misses': { type: 'array', items: { type: 'string' }, description: 'Individual words that add randomness to how this weapon may miss (eg: [swipe, swing, paw])' },
              'weapon.$key.scales.str': { type: 'number', description: 'Precision 1 number that reflects how this weapon scales with strength' },
              'weapon.$key.scales.dex': { type: 'number', description: 'Precision 1 number that reflects how this weapon scales with dexterity' },
              'weapon.$key.scales.int': { type: 'number', description: 'Precision 1 number that reflects how this weapon scales with intellect' },
              'weapon.$key.scales.wis': { type: 'number', description: 'Precision 1 number that reflects how this weapon scales with wisdom' },
            },
          },
        },
      },
    ],
    instructions: `
      You are the Dungeon Master for an interactive MUD.
      Your task is to generate creative content designed to drive player interest, interaction, conflict, setback, and progression throughout the game.
    `,
  });
});

program.command('prompt')
  .argument('<prompt...>')
  .option('-f, --file <name>', 'filename', 'response')
  .action(async (prompt, opts, command) => {
    const { file } = opts;
    const { openai, dungeonMaster } = command;
    const content = `Examine the current game content. ${prompt.flat().join(' ')}`;
    const filename = `${file}.${new Date().getTime()}.json`;
    const filepath = Path.join(__dirname, 'output', filename);

    console.log(content);

    const data = {};

    // Prompt the Dungeon Master
    const result = await openai.beta.threads.createAndRun({
      assistant_id: dungeonMaster,
      thread: { messages: [{ role: 'user', content }] },
    });

    // Await DM Response
    await new Loop(async (_, { abort }) => {
      await APP.timeout(5000);
      const run = await openai.beta.threads.runs.retrieve(result.thread_id, result.id);
      console.log(run.status);

      switch (run.status) {
        case 'requires_action': {
          const calls = run.required_action.submit_tool_outputs.tool_calls;
          calls.forEach(call => Object.assign(data, JSON.parse(call.function.arguments)));
          await openai.beta.threads.runs.submitToolOutputs(result.thread_id, run.id, {
            tool_outputs: calls.map(call => ({ tool_call_id: call.id, output: 'ok' })),
          });
          break;
        }
        case 'completed': {
          abort(data);
          break;
        }
        default: {
          break; // loop
        }
      }
    })();

    // Capture Response
    FS.writeFileSync(filepath, JSON.stringify(data, null, 2));
  });

program.command('commit').action(() => {
  const files = [];
  const sourceDir = `${__dirname}/output`;
  const destination = `${__dirname}/../src/database.json`;
  const database = JSON.parse(FS.readFileSync(destination));

  // Assemble new database
  FS.readdirSync(sourceDir).forEach((filename) => {
    const filepath = `${sourceDir}/${filename}`;
    const config = JSON.parse(FS.readFileSync(filepath));
    Object.assign(database, config);
    files.push(filepath);
  });

  // Write database
  FS.writeFileSync(destination, JSON.stringify(database, (key, value) => {
    if (value != null) return value;
    return undefined;
  }, 2));

  // Cleanup files
  // files.forEach(file => FS.unlinkSync(file));
});

//
program.parseAsync(process.argv);
