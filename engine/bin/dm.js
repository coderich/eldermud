const FS = require('fs');
const Path = require('path');
const OpenAI = require('openai');
const get = require('lodash.get');
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

program.command('train').action(async (thisCommand, actionCommand) => {
  const { openai, dungeonMaster } = actionCommand;

  // Update DM
  await openai.beta.assistants.update(dungeonMaster, {
    name: 'Dungeon Master',
    file_ids: [],
    tools: [
      { type: 'retrieval' },
      {
        type: 'function',
        function: {
          name: 'manage',
          description: `
            Manage flattened MUD data
            A map must include rooms that are a mixure of POIs and connecting pathways
            A #direction is one of {n,s,e,w,ne,nw,se,sw,u,d}
            Every room must be connected and accessible via exits
            Every exit must have an entrance back from the room it connects
            References must follow the syntax "\${self:full.path.to.data}"
            Every $key must be substituted with a meaningful camelCase name
          `,
          parameters: {
            type: 'object',
            properties: {
              'map.$key.name': { type: 'string' },
              'map.$key.description': { type: 'string' },
              'map.$key.rooms.$key.name': { type: 'string' },
              'map.$key.rooms.$key.char': { type: 'string', description: 'If a POI, denote it with a single character' },
              'map.$key.rooms.$key.description': { type: 'string' },
              'map.$key.rooms.$key.exits.#direction': { type: 'string', description: '${self:reference} to room' },
              'map.$key.rooms.$key.shop': { type: 'string', description: '${self:reference} to shop' },

              'shop.$key.name': { type: 'string' },
              'shop.$key.description': { type: 'string' },
              'shop.$key.inventory': { type: 'array', items: { type: 'string', description: '${self:reference} to {item,weapon}' } },

              'item.$key.name': { type: 'string' },
              'item.$key.depiction': { type: 'string' },
              'item.$key.description': { type: 'string' },
              'item.$key.value': { type: 'integer' },
              'item.$key.weight': { type: 'integer' },

              'weapon.$key.name': { type: 'string' },
              'weapon.$key.depiction': { type: 'string' },
              'weapon.$key.description': { type: 'string' },
              'weapon.$key.dmg': { type: 'number' },
              'weapon.$key.range': { type: 'string', enum: ['1', '2', '3'] },
              'weapon.$key.speed': { type: 'integer' },
              'weapon.$key.value': { type: 'integer' },
              'weapon.$key.weight': { type: 'integer' },
              'weapon.$key.hits': { type: 'array', items: { type: 'string', description: 'singular' }, description: 'eg: [scratch, rip, tear]' },
              'weapon.$key.misses': { type: 'array', items: { type: 'string', description: 'singular' }, description: 'eg: [swipe, swing, paw]' },
              'weapon.$key.scales.$stat': { type: 'number', description: 'Precision 1. Repeat for every $stat' },
              'weapon.$key.minRequired.$stat': { type: 'string', description: 'Minimum requirements. Repeat for every $stat' },
            },
          },
        },
      },
      // {
      //   type: 'function',
      //   function: {
      //     name: 'mutateData',
      //     description: `
      //       Mutate Game Data
      //       Follow AD&D 2E standards
      //       References must have the syntax "\${self:path.to.reference}"
      //       "$key" properties must be substituted with a meaningful varName
      //       "$stat" properties must be substituted for every {str,dex,int,wis,con,cha,lvl,exp}
      //       Type "number" can also accept a dice-roll string eg "2d6+4"
      //     `,
      //     parameters: {
      //       type: 'object',
      //       properties: {
      //         'trait.$key.name': { type: 'string' },
      //         'trait.$key.description': { type: 'string' },

      //         'ability.$key.name': { type: 'string' },
      //         'ability.$key.description': { type: 'string' },
      //         'ability.$key.minRequired.$stat': { type: 'string' },

      //         'race.$key.name': { type: 'string' },
      //         'race.$key.depiction': { type: 'string' },
      //         'race.$key.description': { type: 'string' },
      //         'race.$key.bonus.$stat': { type: 'integer', description: 'Bonus value for every stat' },
      //         'race.$key.traits': { type: 'array', items: { type: 'string', description: '${self:reference} to trait' } },

      //         'class.$key.name': { type: 'string' },
      //         'class.$key.depiction': { type: 'string' },
      //         'class.$key.description': { type: 'string' },
      //         'class.$key.$stat': { type: 'integer', description: 'Start value for every $stat' },
      //         'class.$key.traits': { type: 'array', items: { type: 'string', description: '${self:reference} to trait' } },
      //         'class.$key.abilities': { type: 'array', items: { type: 'string', description: '${self:reference} to ability' } },

      //         'npc.$key.name': { type: 'string' },
      //         'npc.$key.depiction': { type: 'string' },
      //         'npc.$key.description': { type: 'string' },

      //         'creature.$key.name': { type: 'string' },
      //         'creature.$key.depiction': { type: 'string' },
      //         'creature.$key.description': { type: 'string' },
      //         'creature.$key.slain': { type: 'string', description: 'Depict when slain' },
      //         'creature.$key.$stat': { type: 'integer', description: 'Start value for every $stat' },
      //         'creature.$key.random.ranks': { type: 'array', items: { type: 'string', description: 'Singular noun' } },
      //         'creature.$key.random.impressions': { type: 'array', items: { type: 'string', description: 'Singular adjective' } },
      //         'creature.$key.random.movements': { type: 'array', items: { type: 'string', description: 'Singular verb' } },
      //         'creature.$key.attacks': { type: 'array', items: { type: 'string', description: '${self:reference} to weapon' } },
      //         'creature.$key.traits': { type: 'array', items: { type: 'string', description: '${self:reference} to trait' } },
      //         'creature.$key.abilities': { type: 'array', items: { type: 'string', description: '${self:reference} to ability' } },

      //         'map.$key.name': { type: 'string' },
      //         'map.$key.description': { type: 'string' },
      //         'map.$key.rooms.$key.name': { type: 'string' },
      //         'map.$key.rooms.$key.char': { type: 'string', description: 'Denote a special room' },
      //         'map.$key.rooms.$key.description': { type: 'string' },
      //         'map.$key.rooms.$key.exits.$direction': { type: 'string', description: 'Define exit in $direction {n,s,e,w,ne,nw,se,sw,u,d} to ${self:reference} room' },
      //         'map.$key.rooms.$key.shop': { type: 'string', description: '${self:reference} to shop' },
      //         'map.$key.rooms.$key.respawn': { type: 'number', description: 'If spawns, how long to respawn' },
      //         'map.$key.rooms.$key.spawns': {
      //           type: 'array',
      //           items: {
      //             type: 'object',
      //             properties: {
      //               num: { type: 'number' },
      //               units: { type: 'array', items: { type: 'string', description: '${self:reference} creature' } },
      //             },
      //           },
      //           description: 'Spawn creatures',
      //         },

      //         // 'blockade.$key.name': { type: 'string' },
      //         // 'blockade.$key.depiction': { type: 'string' },
      //         // 'blockade.$key.description': { type: 'string' },
      //         // 'blockade.$key.successMsg': { type: 'string' },
      //         // 'blockade.$key.failureMsg': { type: 'string' },
      //         // 'blockade.$key.requires': { type: 'array', items: { type: 'string' }, description: '${self:reference} to items required to pass' },

      //         // 'door.$key.name': { type: 'string' },
      //         // 'door.$key.description': { type: 'string' },
      //         // 'door.$key.key': { type: 'string', description: '${self:reference} to item if any' },

      //         'shop.$key.name': { type: 'string' },
      //         'shop.$key.description': { type: 'string' },
      //         'shop.$key.inventory': { type: 'array', items: { type: 'string', description: '${self:reference} to {item,weapon}' } },

      //         'item.$key.name': { type: 'string' },
      //         'item.$key.depiction': { type: 'string' },
      //         'item.$key.description': { type: 'string' },
      //         'item.$key.value': { type: 'integer' },
      //         'item.$key.weight': { type: 'integer' },

      //         'weapon.$key.name': { type: 'string' },
      //         'weapon.$key.depiction': { type: 'string' },
      //         'weapon.$key.description': { type: 'string' },
      //         'weapon.$key.dmg': { type: 'number' },
      //         'weapon.$key.range': { type: 'string', enum: ['1', '2', '3'] },
      //         'weapon.$key.speed': { type: 'integer' },
      //         'weapon.$key.value': { type: 'integer' },
      //         'weapon.$key.weight': { type: 'integer' },
      //         'weapon.$key.hits': { type: 'array', items: { type: 'string', description: 'singular' }, description: 'eg: [scratch, rip, tear]' },
      //         'weapon.$key.misses': { type: 'array', items: { type: 'string', description: 'singular' }, description: 'eg: [swipe, swing, paw]' },
      //         'weapon.$key.scales.$stat': { type: 'number', description: 'Precision 1. Repeat for every $stat' },
      //         'weapon.$key.minRequired.$stat': { type: 'string', description: 'Minimum requirements. Repeat for every $stat' },
      //       },
      //     },
      //   },
      // },
    ],
    instructions: 'You are a creative Dungeon Master',
  });
});

program.command('query')
  .argument('<query>')
  .argument('[datasets...]')
  .action(async (content, datasets, opts, command) => {
    const { openai, dungeonMaster } = command;
    const filename = `response.${new Date().getTime()}.json`;
    const filepath = Path.join(__dirname, 'output', filename);
    const { config } = CONFIG.toObject();

    // Create training files
    const files = await Promise.all(datasets.map(async (dataset) => {
      const data = JSON.stringify(Util.flatten(get(config, dataset, {}), { safe: true }));
      const file = await OpenAI.toFile(Buffer.from(data));
      return openai.files.create({ file, purpose: 'assistants' });
    }));

    const data = {};

    // Query the Dungeon Master
    const result = await openai.beta.threads.createAndRun({
      assistant_id: dungeonMaster,
      thread: { messages: [{ role: 'user', content, file_ids: files.map(f => f.id) }] },
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

    // Delete files
    await Promise.all(files.map(file => openai.files.del(file.id)));
  });

program.command('stage').action(() => {
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

  // // Cleanup files
  // files.forEach(file => FS.unlinkSync(file));
});

program.command('commit').action(() => {

});

//
program.parseAsync(process.argv);
