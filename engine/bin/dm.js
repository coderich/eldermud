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

program.name('DM').description('Dungeon Master');

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

  // // Convert to JSONL format
  // const training = [
  //   JSON.stringify({
  //     messages: [
  //       { role: 'system', content: 'You are the Dungeon Master' },
  //       { role: 'user', content: 'Study the current game content' },
  //       { role: 'assistant', content: JSON.stringify(content) },
  //     ],
  //   }),
  // ].join('\n');

  // // Create training file
  // const file = await openai.files.create({
  //   file: await OpenAI.toFile(Buffer.from(training)),
  // });
  //   purpose: 'assistants',

  // Update DM
  await openai.beta.assistants.update(dungeonMaster, {
    name: 'Dungeon Master',
    file_ids: [],
    tools: [
      // { type: 'retrieval' },
      // {
      //   type: 'function',
      //   function: {
      //     name: 'query',
      //     description: `
      //       Query Game Content.
      //     `,
      //   },
      // },
      {
        type: 'function',
        function: {
          name: 'mutate',
          description: `
            Mutate Game Data
            Props that contain "$" must be replaced with a meaningful variable name
            To self-reference data use syntax "\${self:path.to.data}"
            You are required to create all the data neccessary to complete a task (including the self-referenced data)
            Data type "number" can also accept a dice-roll string eg "2d6+4"
          `,
          parameters: {
            type: 'object',
            properties: {
              'map.$key.name': { type: 'string' },
              'map.$key.description': { type: 'string' },
              'map.$key.rooms.$key.name': { type: 'string' },
              'map.$key.rooms.$key.char': { type: 'string', description: 'A character (used sparingly) to mark a special room' },
              'map.$key.rooms.$key.description': { type: 'string' },
              'map.$key.rooms.$key.exits.$direction': { type: 'string', description: 'Define an exit {n,s,e,w,ne,nw,se,sw,u,d} to another room via ${self:reference}' },
              'map.$key.rooms.$key.shop': { type: 'string', description: '${self:reference} to a shop' },
              'map.$key.rooms.$key.respawn': { type: 'number', description: 'If spawns, how long to respawn' },
              'map.$key.rooms.$key.spawns': {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    num: { type: 'number' },
                    // respawn: { type: 'number', description: 'Respawn counter after death' },
                    units: { type: 'array', items: { type: 'string' }, description: '${self:reference} to creatures' },
                  },
                },
                description: 'Spawn creatures',
              },

              'race.$key.name': { type: 'string' },
              'race.$key.description': { type: 'string' },
              'race.$key.str': { type: 'integer' },
              'race.$key.dex': { type: 'integer' },
              'race.$key.int': { type: 'integer' },
              'race.$key.wis': { type: 'integer' },
              'race.$key.talents': { type: 'array', items: { type: 'string' }, description: '${self:reference} to talents' },
              'race.$key.traits': { type: 'array', items: { type: 'string' }, description: '${self:reference} to traits' },

              'class.$key.name': { type: 'string' },
              'class.$key.description': { type: 'string' },
              'class.$key.str': { type: 'integer' },
              'class.$key.dex': { type: 'integer' },
              'class.$key.int': { type: 'integer' },
              'class.$key.wis': { type: 'integer' },
              'class.$key.pri': { type: 'string', enum: ['str', 'dex', 'int', 'wis'], description: 'Primary' },
              'class.$key.talents': { type: 'array', items: { type: 'string' }, description: '${self:reference} to talents' },
              'class.$key.traits': { type: 'array', items: { type: 'string' }, description: '${self:reference} to traits' },
              'class.$key.attacks': { type: 'array', items: { type: 'string' }, description: '${self:reference} to weapons' },

              'npc.$key.name': { type: 'string' },
              'npc.$key.visual': { type: 'string', description: 'Description when looked at' },
              'npc.$key.description': { type: 'string' },
              'npc.$key.map': { type: 'string', description: '${self:reference} to map' },
              'npc.$key.room': { type: 'string', description: '${self:reference} to room' },
              'npc.$key.talents': { type: 'array', items: { type: 'string' }, description: '${self:reference} to talents' },
              'npc.$key.traits': { type: 'array', items: { type: 'string' }, description: '${self:reference} to traits' },

              'creature.$key.name': { type: 'string' },
              'creature.$key.visual': { type: 'string', description: 'Description when looked at' },
              'creature.$key.description': { type: 'string' },
              'creature.$key.leadership': { type: 'number' },
              'creature.$key.str': { type: 'integer' },
              'creature.$key.dex': { type: 'integer' },
              'creature.$key.int': { type: 'integer' },
              'creature.$key.wis': { type: 'integer' },
              'creature.$key.pri': { type: 'string', enum: ['str', 'dex', 'int', 'wis'], description: 'Primary' },
              'creature.$key.lvl': { type: 'number' },
              'creature.$key.exp': { type: 'integer' },
              'creature.$key.slain': { type: 'string', description: 'Description when slain' },
              'creature.$key.ranks': { type: 'array', items: { type: 'string' }, description: 'Creature hierarchy, if any' },
              'creature.$key.adjectives': { type: 'array', items: { type: 'string' }, description: 'eg: []' },
              'creature.$key.moves': { type: 'array', items: { type: 'string' }, description: 'eg: [creep, scuttle, wobble]' },
              'creature.$key.attacks': { type: 'array', items: { type: 'string' }, description: '${self:reference} to weapons this creature can attack with' },
              'creature.$key.talents': { type: 'array', items: { type: 'string' }, description: '${self:reference} to talents' },
              'creature.$key.traits': { type: 'array', items: { type: 'string' }, description: '${self:reference} to traits' },

              // 'blockade.$key.name': { type: 'string', description: 'The blockade name' },
              // 'blockade.$key.label': { type: 'string', description: 'A short label that will prefix the exit it blocks (lowercase)' },
              // 'blockade.$key.visual': { type: 'string', description: 'Visually describe this blockade' },
              // 'blockade.$key.requires': { type: 'array', items: { type: 'string' }, description: '${self:reference} to all things required to overcome this blockade' },
              'door.$key.name': { type: 'string' },
              'door.$key.visual': { type: 'string', description: 'Description when looked at' },
              'door.$key.description': { type: 'string' },
              'door.$key.key': { type: 'string', description: '${self:reference} to item if any' },
              'door.$key.status': { type: 'string', enum: ['open', 'closed', 'locked'] },
              'door.$key.durability': { type: 'integer' },
              'door.$key.picklock': { type: 'integer' },

              // 'talent.$key.name': { type: 'string' },
              // 'talent.$key.description': { type: 'string' },
              'trait.$key.name': { type: 'string' },
              'trait.$key.description': { type: 'string' },
              'trait.$key.mechanics': { type: 'array', items: { type: 'string' }, description: '${self:reference} to mechanics' },
              'mechanic.$key.name': { type: 'string' },
              'mechanic.$key.description': { type: 'string' },

              'shop.$key.name': { type: 'string' },
              'shop.$key.description': { type: 'string' },
              'shop.$key.inventory': { type: 'array', items: { type: 'string' }, description: '${self:reference} to {item,weapon}' },
              'item.$key.name': { type: 'string' },
              'item.$key.visual': { type: 'string', description: 'Description when looked at' },
              'item.$key.description': { type: 'string' },
              'item.$key.value': { type: 'integer' },
              'item.$key.weight': { type: 'integer' },
              'weapon.$key.name': { type: 'string' },
              'weapon.$key.visual': { type: 'string', description: 'Description when looked at' },
              'weapon.$key.description': { type: 'string' },
              'weapon.$key.dmg': { type: 'number' },
              'weapon.$key.range': { type: 'string', enum: ['1', '2', '3'] },
              'weapon.$key.speed': { type: 'integer' },
              'weapon.$key.value': { type: 'integer' },
              'weapon.$key.weight': { type: 'integer' },
              'weapon.$key.hits': { type: 'array', items: { type: 'string' }, description: 'eg: [scratch, rip, tear]' },
              'weapon.$key.misses': { type: 'array', items: { type: 'string' }, description: 'eg: [swipe, swing, paw]' },
              'weapon.$key.scales.$stat': { type: 'number', description: 'Precision 1 number. $stat {str,dex,int,wis}' },
            },
          },
        },
      },
    ],
    instructions: 'You are a creative Dungeon Master',
  });
});

program.command('prompt')
  .argument('<prompt...>')
  .option('-f, --file <name>', 'filename', 'response')
  .action(async (prompt, opts, command) => {
    const { file } = opts;
    const { openai, dungeonMaster } = command;
    const content = prompt.flat().join(' ');
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
          console.log(run);
          abort();
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
  FS.writeFileSync(destination, JSON.stringify(Util.unflatten(database), (key, value) => {
    if (value != null) return value;
    return undefined;
  }, 2));

  // Cleanup files
  // files.forEach(file => FS.unlinkSync(file));
});

//
program.parseAsync(process.argv);
