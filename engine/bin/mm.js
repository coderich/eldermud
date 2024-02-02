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

program.name('MM').description('Map Maker');

// Setup
program.hook('preAction', (thisCommand, actionCommand) => {
  global.SYSTEM = new EventEmitter().setMaxListeners(5);
  global.CONFIG = new ConfigClient(`${__dirname}/../src/data`);
  global.CONFIG.merge(ConfigClient.parseFile(`${__dirname}/../src/database.json`));
  global.APP = AppService;
  const { apiKey, mapMaker } = CONFIG.get('secrets.openai');
  actionCommand.mapMaker = mapMaker;
  actionCommand.openai = new OpenAI({ apiKey });
});

program.command('train').action(async (thisCommand, actionCommand) => {
  const { openai, mapMaker } = actionCommand;

  // Update DM
  await openai.beta.assistants.update(mapMaker, {
    name: 'Map Maker',
    file_ids: [],
    tools: [
      { type: 'retrieval' },
      {
        type: 'function',
        function: {
          name: 'map',
          description: `
            The model is flattened and parallel calls for the same map are safe.
            A #direction is one of {n,s,e,w,ne,nw,se,sw,u,d}.
            Every $key must be substituted with a meaningful camelCase name.
            All rooms must be evenly spaced and logically connected via exits.
            An exit can only connect to an adjacent room.
            Every reference must be defined.
          `,
          parameters: {
            type: 'object',
            properties: {
              'map.$key.name': { type: 'string' },
              'map.$key.description': { type: 'string', description: 'A theme/backstory' },
              'map.$key.rooms.$key.name': { type: 'string' },
              'map.$key.rooms.$key.type': { type: 'string', enum: ['poi', 'structure', 'pathway', 'intersection', 'corner'] },
              'map.$key.rooms.$key.terrain': { type: 'string' },
              'map.$key.rooms.$key.description': { type: 'string', description: 'Describe the room, scenery, terrain, and purpose. Reference any connted POIs.' },
              'map.$key.rooms.$key.exits.#direction': { type: 'string', description: 'Connect rooms via: "${self:map.$key.rooms.$key}"' },
              // 'map.$key.rooms.$key.shop': { type: 'string', description: '${self:shop.$key} reference' },

              // 'map.$key.shops.$key.name': { type: 'string' },
              // 'map.$key.shops.$key.description': { type: 'string' },
              // 'map.$key.shop.$key.inventory': { type: 'array', items: { type: 'string', description: '${self:reference} to {item,weapon}' } },

              // 'blockade.$key.name': { type: 'string' },
              // 'blockade.$key.depiction': { type: 'string' },
              // 'blockade.$key.description': { type: 'string' },
              // 'blockade.$key.successMsg': { type: 'string' },
              // 'blockade.$key.failureMsg': { type: 'string' },
              // 'blockade.$key.requires': { type: 'array', items: { type: 'string' }, description: '${self:reference} to items required to pass' },

              // 'door.$key.name': { type: 'string' },
              // 'door.$key.description': { type: 'string' },
              // 'door.$key.key': { type: 'string', description: '${self:reference} to item if any' },

              // 'npc.$key.name': { type: 'string' },
              // 'npc.$key.quest': { type: 'array', items: { type: 'string', description: '${self:quest.$key} reference' }, description: 'Progressive quests, if any' },
              // 'npc.$key.depiction': { type: 'string' },
              // 'npc.$key.description': { type: 'string' },

              // 'quest.$key.name': { type: 'string' },
              // 'quest.$key.description': { type: 'string' },

              // 'map.$key.rooms.$key.respawn': { type: 'number', description: 'If spawns, how long to respawn' },
              // 'map.$key.rooms.$key.spawns': {
              //   type: 'array',
              //   items: {
              //     type: 'object',
              //     properties: {
              //       num: { type: 'number' },
              //       units: { type: 'array', items: { type: 'string', description: '${self:reference} creature' } },
              //     },
              //   },
              //   description: 'Spawn creatures',
              // },
            },
          },
        },
      },
    ],
    instructions: `
      You are a creative map maker for a MUD.
      Every map must consistently follow a cohesive theme and storyline.
      Open areas must be expressed with many connected rooms that act as pathways.
    `,
  });
});

program.command('query')
  .argument('<query>')
  .argument('[datasets...]')
  .action(async (content, datasets, opts, command) => {
    const { openai, mapMaker } = command;
    const filename = `mm.${new Date().getTime()}.json`;
    const filepath = Path.join(__dirname, 'output', filename);
    const { config } = CONFIG.toObject();

    // Create training files
    const files = await Promise.all(datasets.map(async (dataset) => {
      const data = JSON.stringify(Util.flatten(get(config, dataset, {}), { safe: true }));
      const file = await OpenAI.toFile(Buffer.from(data));
      return openai.files.create({ file, purpose: 'assistants' });
    }));

    // Query the Map Maker
    const result = await openai.beta.threads.createAndRun({
      assistant_id: mapMaker,
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
