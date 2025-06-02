const OpenAI = require('openai');
const { Command } = require('commander');
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
    tools: [
      { type: 'file_search' },
      {
        type: 'function',
        function: {
          name: 'mutateData',
          description: `
            Mutate Game Data.
            Follow AD&D 2E standards.
            References must have the syntax "\${self:path.to.reference}".
            Every $key must be substituted with a meaningful camelCase name.
            "$stat" properties must be substituted for every {str,dex,int,wis,con,cha,lvl,exp}
            Type "number" can also accept a dice-roll string eg "2d6+4".
          `,
          parameters: {
            type: 'object',
            properties: {
              'trait.$key.name': { type: 'string' },
              'trait.$key.description': { type: 'string' },

              // 'talent.$key.name': { type: 'string' },
              // 'talent.$key.description': { type: 'string' },

              'race.$key.name': { type: 'string' },
              'race.$key.depiction': { type: 'string' },
              'race.$key.description': { type: 'string' },
              'race.$key.$stat': { type: 'integer', description: 'Bonus value for every $stat' },
              'race.$key.traits': { type: 'array', items: { type: 'string', description: '${self:reference} to trait' } },

              'class.$key.name': { type: 'string' },
              'class.$key.depiction': { type: 'string' },
              'class.$key.description': { type: 'string' },
              'class.$key.$stat': { type: 'integer', description: 'Start value for every $stat' },
              'class.$key.attack': { type: 'array', items: { type: 'string', description: '${self:reference} to attack' } },
              'class.$key.traits': { type: 'array', items: { type: 'string', description: '${self:reference} to trait' } },

              'creature.$key.name': { type: 'string' },
              'creature.$key.depiction': { type: 'string' },
              'creature.$key.description': { type: 'string' },
              'creature.$key.slain': { type: 'string', description: 'Depict when slain' },
              'creature.$key.$stat': { type: 'integer', description: 'Start value for every $stat' },
              'creature.$key.random.ranks': { type: 'array', items: { type: 'string', description: 'Singular noun' } },
              'creature.$key.random.impressions': { type: 'array', items: { type: 'string', description: 'Singular adjective' } },
              'creature.$key.random.movements': { type: 'array', items: { type: 'string', description: 'Singular verb' } },
              'creature.$key.attacks': { type: 'array', items: { type: 'string', description: '${self:reference} to attack' } },
              'creature.$key.traits': { type: 'array', items: { type: 'string', description: '${self:reference} to trait' } },

              'attack.$key.name': { type: 'string' },
              'attack.$key.depiction': { type: 'string' },
              'attack.$key.description': { type: 'string' },
              'attack.$key.dmg': { type: 'number' },
              'attack.$key.range': { type: 'string', enum: ['1', '2', '3', '4', '5'] },
              'attack.$key.speed': { type: 'integer' },
              'attack.$key.hits': { type: 'array', items: { type: 'string', description: 'singular' }, description: 'eg: [scratch, rip, tear]' },
              'attack.$key.misses': { type: 'array', items: { type: 'string', description: 'singular' }, description: 'eg: [swipe, swing, paw]' },
              'attack.$key.scales.$stat': { type: 'number', description: 'Precision 1. Repeat for every $stat' },
            },
          },
        },
      },
    ],
    instructions: `
      You are a creative Dungeon Master for a MUD.
      This MUD is a mix of HighFantasy, DarkFantasy, and Necromancy themes.
    `,
  });
});

program.command('query')
  .argument('<query>')
  .argument('[datasets...]')
  .action(async (content, datasets, opts, command) => {
    const { openai, dungeonMaster } = command;
    return Service.query(openai, dungeonMaster, content, datasets);
  });

//
program.parseAsync(process.argv);
