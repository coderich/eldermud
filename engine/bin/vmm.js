const FS = require('fs');
const OpenAI = require('openai');
const { Command } = require('commander');
const ConfigClient = require('../src/service/ConfigClient');
const EventEmitter = require('../src/service/EventEmitter');
const AppService = require('../src/service/AppService');
const Service = require('./service');

const program = new Command();

program.name('VMM').description('Visual Map Maker');

// Setup
program.hook('preAction', (thisCommand, actionCommand) => {
  global.SYSTEM = new EventEmitter().setMaxListeners(5);
  global.CONFIG = new ConfigClient(`${__dirname}/../src/data`);
  global.CONFIG.merge(ConfigClient.parseFile(`${__dirname}/../src/database.json`));
  global.APP = AppService;
  const { apiKey } = CONFIG.get('secrets.openai');
  actionCommand.openai = new OpenAI({ apiKey });
});

program.command('query').action(async (thisCommand, actionCommand) => {
  const { openai } = actionCommand;
  const file = FS.readFileSync(`${__dirname}/input/maps/The Hacienda Battle Map - Launch _ Afternoon Maps.jpeg`);
  const image = Buffer.from(file).toString('base64');

  // Query...
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    tools: [Service.tools.map],
    // tool_choice: { type: 'function', function: { name: 'map' } },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'what is this image?' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${image}` } },
        ],
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
});

//
program.parseAsync(process.argv);
