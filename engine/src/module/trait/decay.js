const { Action, Loop } = require('@coderich/gameflow');

Action.define('decay', [
  (_, { stream, abort }) => {
    stream.on('abort', abort);
  },

  new Loop([
    () => APP.timeout(5000),

    async (_, { actor, promise }) => {
      if (!promise.aborted) {
        const { durability } = await actor.perform('affect', { durability: -1 });

        if (durability <= 0) {
          await actor.broadcast('text', `${actor.name} disintegrates into dust.`);
          await actor.perform('destroy');
        }
      }
    },
  ]),
]);
