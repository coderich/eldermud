const FS = require('fs');
const Path = require('path');
const OpenAI = require('openai');
const Util = require('@coderich/util');

describe('openai', () => {
  let openai, config;

  beforeAll(() => {
    config = CONFIG.get('secrets.openai');
    openai = new OpenAI({ apiKey: config.apiKey });
  });

  test('Create a world', async () => {
    let run;

    const result = await openai.beta.threads.createAndRun({
      assistant_id: config.dungeonMaster,
      thread: {
        // response_format: 'json_object',
        messages: [
          {
            role: 'user',
            content: `
              Please access the current data model and then generate a unique map that consists of 30 rooms suitable as a pilot of in-game testing.
              Feel free to be as creative as you like but the JSON output must be fully complete and ready for play with the current Data Model.
            `,
          },
        ],
      },
    });

    do {
      await Util.timeout(5000);
      run = await openai.beta.threads.runs.retrieve(result.thread_id, result.id);
      console.log(run);
    } while (run?.status !== 'completed');

    const messages = await openai.beta.threads.messages.list(result.thread_id);
    FS.writeFileSync(Path.join(__dirname, 'messages.json'), JSON.stringify(messages.data, null, 2));
  });

  // test('Image Fun', async () => {
  //   const image = await openai.images.generate({ model: 'dall-e-3', prompt: 'The cutest puppy dog face to send to my girlfriend!' });
  //   expect(image).toBeDefined();
  //   console.log(image.data);
  // });
});
