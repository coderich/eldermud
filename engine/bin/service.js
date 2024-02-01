const merge = require('lodash.merge');
const { Loop } = require('@coderich/gameflow');

module.exports = {
  functions: {
    map: {
      type: 'function',
      function: {
        name: 'map',
        description: `
          The model is flattened and parallel calls for the same map are safe.
          A #direction is one of {n,s,e,w,ne,nw,se,sw,u,d}.
          Every $key must be substituted with a meaningful camelCase name.
          All rooms must be logically connected via exits.
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
            // 'map.$key.rooms.$key.shop': { type: 'string', description: '${self:reference} to shop' },
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
  },
  awaitResult: async (openai, result) => {
    const data = {};

    // Await DM Response
    await new Loop(async (_, { abort }) => {
      await APP.timeout(5000);
      const run = await openai.beta.threads.runs.retrieve(result.thread_id, result.id);
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
