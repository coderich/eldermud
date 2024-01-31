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
      // { type: 'retrieval' },
      Service.functions.map,
    ],
    instructions: `
      You are a creative map maker for a MUD.
      Every map must consistently follow a cohesive theme and storyline.
      Every map must utilize exits in all directions.
      You must perform your duties within the confines of a single map.
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
