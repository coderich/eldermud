const merge = require('lodash.merge');
const { Loop } = require('@coderich/gameflow');

module.exports = {
  awaitResult: async (openai, result) => {
    const data = {};

    // Await response
    await new Loop(async (_, { abort }) => {
      await APP.timeout(5000);

      const run = await openai.beta.threads.runs.retrieve(result.thread_id, result.id).catch((e) => {
        console.log(e);
        return { status: 'error' };
      });

      console.log(run.status);

      switch (run.status) {
        case 'requires_action': {
          const calls = run.required_action.submit_tool_outputs.tool_calls;
          console.log(JSON.stringify(calls, null, 2));
          calls.forEach(call => merge(data, JSON.parse(call.function.arguments)));
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

    return data;
  },
};
