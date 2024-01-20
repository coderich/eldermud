const { Action, Loop } = require('@coderich/gameflow');

Action.define('hunter', [
  (_, context) => {
    context.stream.on('abort', context.abort);

    new Loop(async (__, { actor, promise }) => {
      await APP.timeout(5000);
      if (!actor.$target && !promise.aborted) {
        const room = CONFIG.get(await REDIS.get(`${actor}.room`));
        const dir = APP.randomElement(Object.keys(room.exits));
        await actor.perform('move', dir);
      }
    })(_, context);
  },
]);
