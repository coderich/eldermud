const FS = require('fs');
const Path = require('path');
const OpenAI = require('openai');
const get = require('lodash.get');
const merge = require('lodash.merge');
const Util = require('@coderich/util');
const { Loop } = require('@coderich/gameflow');

exports.query = async (openai, assistant, content, datasets) => {
  const filename = `assistant.${new Date().getTime()}.json`;
  const filepath = Path.join(__dirname, 'output', filename);
  const { config } = CONFIG.toObject();

  // Create training files
  const files = await Promise.all(datasets.map(async (dataset) => {
    const data = JSON.stringify(Util.flatten(get(config, dataset, {}), { safe: true }));
    const file = await OpenAI.toFile(Buffer.from(data), 'input.json');
    return openai.files.create({ file, purpose: 'assistants' });
  }));

  console.log(files);

  // Query the Assistant
  const result = await openai.beta.threads.createAndRun({
    assistant_id: assistant,
    thread: {
      messages: [{
        role: 'user',
        content,
        attachments: files.map(f => ({
          file_id: f.id,
          tools: [{ type: 'file_search' }],
        })),
        // file_ids: files.map(f => f.id),
      }],
    },
  });

  //
  const data = await exports.awaitResult(openai, result);

  // Capture Response
  FS.writeFileSync(filepath, JSON.stringify(data, null, 2));

  // Delete files
  await Promise.all(files.map(file => openai.files.delete(file.id)));
};

exports.awaitResult = async (openai, result) => {
  const data = {};

  // Await response
  await new Loop(async (_, { abort }) => {
    await APP.timeout(5000);

    const run = await openai.beta.threads.runs.retrieve(result.id, result).catch((e) => {
      console.log(e);
      return { status: 'error' };
    });

    switch (run.status) {
      case 'requires_action': {
        const calls = run.required_action.submit_tool_outputs.tool_calls;
        console.log(JSON.stringify(calls, null, 2));
        calls.forEach(call => merge(data, JSON.parse(call.function.arguments)));
        await openai.beta.threads.runs.submitToolOutputs(run.id, {
          thread_id: result.thread_id,
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

  return data;
};
