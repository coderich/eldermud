const FS = require('fs');
const Path = require('path');
const OpenAI = require('openai');
const get = require('lodash.get');
const { Command } = require('commander');
const Util = require('@coderich/util');
const ConfigClient = require('../src/service/ConfigClient');
const EventEmitter = require('../src/service/EventEmitter');
const AppService = require('../src/service/AppService');
const Service = require('./service');

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
          name: 'mutateData',
          description: `
            Mutate Game Data
            Follow AD&D 2E standards
            References must have the syntax "\${self:path.to.reference}"
            Every $key must be substituted with a meaningful camelCase name.
            "$stat" properties must be substituted for every {str,dex,int,wis,con,cha,lvl,exp}
            Type "number" can also accept a dice-roll string eg "2d6+4"
          `,
          parameters: {
            type: 'object',
            properties: {
              'trait.$key.name': { type: 'string' },
              'trait.$key.description': { type: 'string' },

              'ability.$key.name': { type: 'string' },
              'ability.$key.description': { type: 'string' },
              'ability.$key.minRequired.$stat': { type: 'string' },

              'race.$key.name': { type: 'string' },
              'race.$key.depiction': { type: 'string' },
              'race.$key.description': { type: 'string' },
              'race.$key.bonus.$stat': { type: 'integer', description: 'Bonus value for every stat' },
              'race.$key.traits': { type: 'array', items: { type: 'string', description: '${self:reference} to trait' } },

              'class.$key.name': { type: 'string' },
              'class.$key.depiction': { type: 'string' },
              'class.$key.description': { type: 'string' },
              'class.$key.$stat': { type: 'integer', description: 'Start value for every $stat' },
              'class.$key.traits': { type: 'array', items: { type: 'string', description: '${self:reference} to trait' } },
              'class.$key.abilities': { type: 'array', items: { type: 'string', description: '${self:reference} to ability' } },

              'creature.$key.name': { type: 'string' },
              'creature.$key.depiction': { type: 'string' },
              'creature.$key.description': { type: 'string' },
              'creature.$key.slain': { type: 'string', description: 'Depict when slain' },
              'creature.$key.$stat': { type: 'integer', description: 'Start value for every $stat' },
              'creature.$key.random.ranks': { type: 'array', items: { type: 'string', description: 'Singular noun' } },
              'creature.$key.random.impressions': { type: 'array', items: { type: 'string', description: 'Singular adjective' } },
              'creature.$key.random.movements': { type: 'array', items: { type: 'string', description: 'Singular verb' } },
              'creature.$key.attacks': { type: 'array', items: { type: 'string', description: '${self:reference} to weapon' } },
              'creature.$key.traits': { type: 'array', items: { type: 'string', description: '${self:reference} to trait' } },
              'creature.$key.abilities': { type: 'array', items: { type: 'string', description: '${self:reference} to ability' } },

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

              'quest.$key.name': { type: 'string' },
              'quest.$key.description': { type: 'string' },
            },
          },
        },
      },
    ],
    instructions: 'You are a creative Dungeon Master',
  });
});

program.command('query')
  .argument('<query>')
  .argument('[datasets...]')
  .action(async (content, datasets, opts, command) => {
    const { openai, dungeonMaster } = command;
    const filename = `dm.${new Date().getTime()}.json`;
    const filepath = Path.join(__dirname, 'output', filename);
    const { config } = CONFIG.toObject();

    // Create training files
    const files = await Promise.all(datasets.map(async (dataset) => {
      const data = JSON.stringify(Util.flatten(get(config, dataset, {}), { safe: true }));
      const file = await OpenAI.toFile(Buffer.from(data));
      return openai.files.create({ file, purpose: 'assistants' });
    }));

    // Query the Dungeon Master
    const result = await openai.beta.threads.createAndRun({
      assistant_id: dungeonMaster,
      thread: { messages: [{ role: 'user', content, file_ids: files.map(f => f.id) }] },
    });

    //
    const data = await Service.awaitResult(openai, result);

    // Capture Response
    FS.writeFileSync(filepath, JSON.stringify(data, null, 2));

    // Delete files
    await Promise.all(files.map(file => openai.files.del(file.id)));
  });

//
program.parseAsync(process.argv);
