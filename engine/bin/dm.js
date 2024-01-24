const FS = require('fs');
const Path = require('path');
const OpenAI = require('openai');
const { Command } = require('commander');
const { Loop } = require('@coderich/gameflow');
const ConfigClient = require('../src/service/ConfigClient');
const EventEmitter = require('../src/service/EventEmitter');
const AppService = require('../src/service/AppService');

const program = new Command();

program.name('DM').description('Eldermud Dungeon Master');

// Setup
program.hook('preAction', (thisCommand, actionCommand) => {
  global.SYSTEM = new EventEmitter().setMaxListeners(5);
  global.CONFIG = new ConfigClient(`${__dirname}/../src/data`);
  global.APP = AppService;
  const { apiKey, dungeonMaster } = CONFIG.get('secrets.openai');
  actionCommand.dungeonMaster = dungeonMaster;
  actionCommand.openai = new OpenAI({ apiKey });
});

// Programs
program.command('train').action(async (thisCommand, actionCommand) => {
  const { openai, dungeonMaster } = actionCommand;

  // Grab all the current content
  const content = FS.readFileSync(Path.join(__dirname, 'output', 'response.1706105356726.json')).toString();

  // Convert to JSONL format
  const dmTraining = [
    JSON.stringify({
      messages: [
        { role: 'system', content: 'You are the Dungeon Master' },
        { role: 'user', content: 'Examine the current content' },
        { role: 'assistant', content },
      ],
    }),
  ].join('\n');

  // Create training file
  const file = await openai.files.create({
    file: await OpenAI.toFile(Buffer.from(dmTraining)),
    purpose: 'assistants',
  });

  // Update DM
  await openai.beta.assistants.update(dungeonMaster, {
    name: 'Dungeon Master',
    file_ids: [file.id],
    tools: [
      { type: 'retrieval' },
      {
        type: 'function',
        function: {
          name: 'upsertContent',
          description: `
            Create or Update Game Content.
            Any time you see a property with $key you must replace it with a unique keyname that identifies the word that comes before it.
            In order to self-reference data, follow Serverless.yml syntax (eg: \${self:map.crypt.rooms.start})
            Any data of type "integer" must be passed in as a string and may be optionally represented as a dice-roll (eg: "2d10+3", "4d10-1")
            Rooms are to be organized on a 2d grid and must not overlap (unless exiting up or down)
            Rooms are conceptually any size; utilize room name, description, and map layout to portray dimension to the player
          `,
          parameters: {
            type: 'object',
            properties: {
              'map.$key.name': { type: 'string', description: 'A unique name for this map' },
              'map.$key.description': { type: 'string', description: 'Describe the tone of this area' },
              'map.$key.rooms.$key.name': { type: 'string', description: 'A unique name for this room (titlecase)' },
              'map.$key.rooms.$key.char': { type: 'string', description: 'A single (ascii ok) character to visually designate a special room on a map' },
              'map.$key.rooms.$key.visual': { type: 'string', description: 'Visually describe this room. You may optionally include hints to secrets within the realm' },
              'map.$key.rooms.$key.description': { type: 'string', description: '' },
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
                    num: { type: 'integer', description: 'The number of creatures to spawn' },
                    units: { type: 'array', items: { type: 'string' }, description: '${self:references} to the creatures to spawn' },
                  },
                },
                description: 'Creatues will spawn in this room from time to time. The array lets you define multiple groups of creatures (eg. You can have a single boss always spawn along with 2d2+1 lesser creatures)',
              },
              'map.$key.rooms.$key.respawn': { type: 'integer', description: 'Specifies the number of seconds creatures will respawn after the room has been cleared' },
              'map.$key.rooms.$key.shop': { type: 'string', description: '${self:reference} to a shop' },

              'class.$key.name': { type: 'string', description: 'The class name' },
              'class.$key.description': { type: 'string', description: 'The class description' },
              'class.$key.str': { type: 'integer', description: 'The class strength' },
              'class.$key.dex': { type: 'integer', description: 'The class dexterity' },
              'class.$key.int': { type: 'integer', description: 'The class intellect' },
              'class.$key.wis': { type: 'integer', description: 'The class wisdom' },
              'class.$key.pri': { type: 'string', enum: ['str', 'dex', 'int', 'wis'], description: 'The class primary stat' },
              'class.$key.talents': { type: 'array', items: { type: 'string' }, description: '${self:references} to talents granted to this class' },
              'class.$key.traits': { type: 'array', items: { type: 'string' }, description: '${self:references} to traits granted to this class' },
              'race.$key.name': { type: 'string', description: 'The race name' },
              'race.$key.description': { type: 'string', description: 'The race description' },
              'race.$key.str': { type: 'integer', description: 'Bonus to strength, if any' },
              'race.$key.dex': { type: 'integer', description: 'Bonus to dexterity, if any' },
              'race.$key.int': { type: 'integer', description: 'Bonus to intellect, if any' },
              'race.$key.wis': { type: 'integer', description: 'Bonus to wisdom, if any' },
              'race.$key.talents': { type: 'array', items: { type: 'string' }, description: '${self:references} to talents granted to this race' },
              'race.$key.traits': { type: 'array', items: { type: 'string' }, description: '${self:references} to traits granted to this race' },

              'npc.$key.name': { type: 'string', description: 'The npc name' },
              'npc.$key.description': { type: 'string', description: 'The npc description' },
              'npc.$key.map': { type: 'string', description: '${self:reference} to the map this npc is in' },
              'npc.$key.room': { type: 'string', description: '${self:reference} to the room this npc is in' },
              'npc.$key.talents': { type: 'array', items: { type: 'string' }, description: '${self:references} to talents granted to this npc' },
              'npc.$key.traits': { type: 'array', items: { type: 'string' }, description: '${self:references} to traits granted to this npc' },
              'creature.$key.name': { type: 'string', description: 'The creature name (lowercase unless a boss)' },
              'creature.$key.description': { type: 'string', description: 'The creature description' },
              'creature.$key.str': { type: 'integer', description: 'The creature strength' },
              'creature.$key.dex': { type: 'integer', description: 'The creature dexterity' },
              'creature.$key.int': { type: 'integer', description: 'The creature intellect' },
              'creature.$key.wis': { type: 'integer', description: 'The creature wisdom' },
              'creature.$key.pri': { type: 'string', enum: ['str', 'dex', 'int', 'wis'], description: 'The creature primary stat' },
              'creature.$key.lvl': { type: 'integer', description: 'The creature experience level' },
              'creature.$key.exp': { type: 'integer', description: 'Player exp gained when creature is slain' },
              'creature.$key.slain': { type: 'string', description: 'A short description that depicts the creatures death' },
              'creature.$key.tiers': { type: 'array', items: { type: 'string' }, description: 'Individual word (adjectives) that describe the creature class-teir. Only useful if creature.lvl is a dice-roll; the higher the die-roll the higher the tier that will be chosen in the array to describe the creature' },
              'creature.$key.adjectives': { type: 'array', items: { type: 'string' }, description: 'Individual word (adjectives) that add randomness to a particular spawn of this creature (eg: [small, giant, huge, fat, skinny, angry])' },
              'creature.$key.moves': { type: 'array', items: { type: 'string' }, description: 'Individual words that add randomness to how a creature may move (eg: [creep, scuttle, wobble])' },
              'creature.$key.attacks': { type: 'array', items: { type: 'string' }, description: '${self:references} to weapons this creature is capable of attacking with' },
              'creature.$key.talents': { type: 'array', items: { type: 'string' }, description: '${self:references} to talents granted to this creature' },
              'creature.$key.traits': { type: 'array', items: { type: 'string' }, description: '${self:references} to traits granted to this creature' },

              'blockade.$key.name': { type: 'string', description: 'The blockade name' },
              'blockade.$key.label': { type: 'string', description: 'A short label that will prefix the exit it blocks (lowercase)' },
              'blockade.$key.description': { type: 'string', description: 'The blockade description' },
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
              'item.$key.description': { type: 'string', description: 'The item description' },
              'weapon.$key.name': { type: 'string', description: 'The weapon name (lowercase unless special)' },
              'weapon.$key.description': { type: 'string', description: 'The weapon description' },
              'weapon.$key.dmg': { type: 'integer', description: 'The weapon damage' },
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

program.command('query')
  .argument('<query...>')
  .option('-f, --file <name>', 'filename', 'response')
  .action(async (query, opts, command) => {
    const { file } = opts;
    const { openai, dungeonMaster } = command;
    const content = query.flat().join(' ');
    const filename = `${file}.${new Date().getTime()}.json`;
    const filepath = Path.join(__dirname, 'output', filename);

    const data = {};

    // Query the Dungeon Master
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

//
program.parseAsync(process.argv);
