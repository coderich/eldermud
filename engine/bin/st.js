const OpenAI = require('openai');
const { Command } = require('commander');
const ConfigClient = require('../src/service/ConfigClient');
const EventEmitter = require('../src/service/EventEmitter');
const AppService = require('../src/service/AppService');
const Service = require('./service');

const program = new Command();

program.name('ST').description('Story Teller');

// Setup
program.hook('preAction', (thisCommand, actionCommand) => {
  global.SYSTEM = new EventEmitter().setMaxListeners(5);
  global.CONFIG = new ConfigClient(`${__dirname}/../src/data`);
  global.CONFIG.merge(ConfigClient.parseFile(`${__dirname}/../src/database.json`));
  global.APP = AppService;
  const { apiKey, storyTeller } = CONFIG.get('secrets.openai');
  actionCommand.storyTeller = storyTeller;
  actionCommand.openai = new OpenAI({ apiKey });
});

program.command('train').action(async (thisCommand, actionCommand) => {
  const { openai, storyTeller } = actionCommand;

  // Update assistant
  await openai.beta.assistants.update(storyTeller, {
    name: 'Story Teller',
    file_ids: [],
    tools: [
      { type: 'retrieval' },
      {
        type: 'function',
        function: {
          name: 'create',
          description: `
            The model is flattened and parallel calls for the same map are safe.
            Every $key must be substituted with a meaningful camelCase name.
          `,
          parameters: {
            type: 'object',
            properties: {
              'npc.$key.name': { type: 'string' },
              'npc.$key.depiction': { type: 'string' },
              'npc.$key.description': { type: 'string' },
              'npc.$key.backstory': { type: 'string' },
              'npc.$key.quests': { type: 'array', items: { type: 'string', description: '${self:quest.$key} reference' }, description: 'Progressive quests' },

              'quest.$key.name': { type: 'string' },
              'quest.$key.description': { type: 'string' },
              'quest.$key.backstory': { type: 'string' },
              'quest.$key.storyline': { type: 'string' },
            },
          },
        },
      },
    ],
    instructions: `
      You are a creative story teller for a MUD.
      This MUD is a mix of HighFantasy, DarkFantasy, and Necromancy themes.
      Your job is to create immersive npc and quest storylines for players.
    `,
  });
});

program.command('query')
  .argument('<query>')
  .argument('[datasets...]')
  .action((content, datasets, opts, command) => {
    const { openai, storyTeller } = command;
    return Service.query(openai, storyTeller, content, datasets);
  });

//
program.parseAsync(process.argv);
