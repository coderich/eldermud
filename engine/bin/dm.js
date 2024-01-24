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

  // // Train DM on our data model
  // const { config: { map: { town }, item, creature, weapon } } = CONFIG.toObject();
  // delete town.blockade;

  // const dataModel = JSON.stringify({ item, creature, weapon, map: { town } }, (key, value) => {
  //   return ['respawn'].includes(key) ? undefined : value;
  // }, 2);

  // FS.writeFileSync(Path.join(__dirname, 'input', 'dataModel.json'), JSON.stringify(dataModelToTrainingData(), null, 2));

  // // Convert to JSONL format
  // const dmTraining = [
  //   JSON.stringify({
  //     messages: [
  //       { role: 'system', content: 'You are the Dungeon Master' },
  //       { role: 'user', content: 'What is the current DataModel?' },
  //       { role: 'assistant', content: dataModel },
  //       { role: 'user', content: 'How do you create self-references within the DataModel?' },
  //       { role: 'assistant', content: 'Follow Serverless: eg. ${self:map.town.rooms.start} ${self:creature.rat} etc' },
  //       { role: 'user', content: 'What is a unit?' },
  //       { role: 'assistant', content: 'A unit refers to a player, creature, or npc' },
  //       { role: 'user', content: 'What are all possible exits a room can have?' },
  //       { role: 'assistant', content: 'n,s,e,w,ne,nw,se,sw,u,d' },
  //       { role: 'user', content: 'What does the char field refer to in the room schema?' },
  //       { role: 'assistant', content: 'The char field is a single character visual indicator; denoting a special room and should be used sparingly' },
  //       { role: 'user', content: 'How do I assign creatures to a room?' },
  //       { role: 'assistant', content: 'Use room.spawns. Each element specifies the number to spawn and a list to choose from' },
  //       // { role: 'user', content: 'What is room.respawn?' },
  //       // { role: 'assistant', content: '' },
  //       { role: 'user', content: 'What does the notation 1d2+1 refer to?' },
  //       { role: 'assistant', content: 'It represents the roll of dice. In this example, you roll a single 2-sided die and add 1 to the result. You may provide a constant value if a roll is unwanted, eg: 1. The following result modifiers are supported: +-*/%**' },
  //     ],
  //   }),
  // ].join('\n');

  // // Create training file
  // const file = await openai.files.create({
  //   file: await OpenAI.toFile(Buffer.from(dmTraining)),
  //   purpose: 'assistants',
  // });

  // Update DM
  await openai.beta.assistants.update(dungeonMaster, {
    name: 'Dungeon Master',
    // file_ids: [file.id],
    tools: [
      { type: 'retrieval' },
      {
        type: 'function',
        function: {
          name: 'upsertContent',
          description: `
            Create or Update Game Content.
            Any time you come across a property with $key you must replace that with a unique keyname that identifies the word that comes before it.
            In order to self-reference data, follow Serverless.yml syntax (eg: \${self:map.crypt.rooms.start})
            Any data of type "number" must be passed in as a string and may be optionally represented as a dice-roll (eg: "2d10+3", "4d10-1")
            Rooms are to be organized on a 2d grid and must not overlap (unless exiting up or down)
            Rooms are roughly 20sq ft as a general but can be easily modified with appropriate room names and descriptons
          `,
          // description: `
          //   Create or Update Game Content.
          //   To create self-references within the data, follow the Serverless approach (eg. \${self:map.map1.rooms.start} \${self:creature.rat} etc).
          //   Never provide a reference to data that is a placeholder; it must always be defined in either the existing DataModel or function payload.
          //   When referencing existing data, avoid anything with the word "test" in it; it is not intended for in-game use.
          // `,
          parameters: {
            type: 'object',
            properties: {
              'map.$key.name': { type: 'string', description: 'A unique name for this map' },
              'map.$key.description': { type: 'string', description: 'A description that describes the tone of the area' },
              'map.$key.rooms.$key.name': { type: 'string', description: 'A unique name for this room' },
              'map.$key.rooms.$key.char': { type: 'string', description: 'A single (ascii ok) character to visually designate a special room on a map' },
              'map.$key.rooms.$key.description': { type: 'string', description: 'A description for this room. The description may contain hints to secrets within the realm' },
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
              'creature.$key.name': { type: 'string', description: 'The creature name' },
              'creature.$key.str': { type: 'number', description: 'The creature strength' },
              'creature.$key.dex': { type: 'number', description: 'The creature dexterity' },
              'creature.$key.int': { type: 'number', description: 'The creature intellect' },
              'creature.$key.wis': { type: 'number', description: 'The creature wisdom' },
              'creature.$key.pri': { type: 'string', enum: ['str', 'dex', 'int', 'wis'], description: 'The creature primary stat' },
              'creature.$key.lvl': { type: 'number', description: 'The creature experience level' },
              // 'creature.$key.tiers': { type: 'array', items: { type: 'string' }, description: '' },
              'creature.$key.adjectives': { type: 'array', items: { type: 'string' }, description: 'Individual word (adjectives) that add randomness to a particular spawn of this creature (eg: [small, giant, huge, fat, skinny, angry])' },
              'creature.$key.moves': { type: 'array', items: { type: 'string' }, description: 'Individual words that add randomness to how a creature may move (eg: [creep, scuttle, wobble])' },
              'creature.$key.attacks': { type: 'array', items: { type: 'string' }, description: '${self:references} to weapons this creature is capable of attacking with' },
              'weapon.$key.name': { type: 'string', description: 'The weapon name' },
              'weapon.$key.dmg': { type: 'number', description: 'The weapon damage' },
              'weapon.$key.hits': { type: 'array', items: { type: 'string' }, description: 'Individual words that add randomness to how this weapon may hit (eg: [scratch, rip, tear])' },
              'weapon.$key.misses': { type: 'array', items: { type: 'string' }, description: 'Individual words that add randomness to how this weapon may miss (eg: [swipe, swing, paw])' },
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
  .option('-f, --file <name>', 'filename', 'response.json')
  .action(async (query, opts, command) => {
    const { file } = opts;
    const { openai, dungeonMaster } = command;
    const content = query.flat().join(' ');
    const filepath = Path.join(__dirname, 'output', file);

    const data = {};

    const result = await openai.beta.threads.createAndRun({
      assistant_id: dungeonMaster,
      thread: {
        messages: [{ role: 'user', content }],
      },
    });

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

    FS.writeFileSync(filepath, JSON.stringify(data, null, 2));
  });

//
program.parseAsync(process.argv);
