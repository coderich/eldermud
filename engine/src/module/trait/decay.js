const { Action, Loop } = require('@coderich/gameflow');

Action.define('decay', [
  (_, context) => {
    context.stream.on('abort', context.abort);

    new Loop(async (__, { actor, promise }) => {
      await APP.timeout(5000);

      if (!promise.aborted) {
        actor.durability = await REDIS.incrBy(`${actor}.durability`, -1);
        if (actor.durability <= 0) {
          await actor.broadcast('text', `${actor.name} disintegrates into dust.`);
          await actor.perform('destroy');
        }
      }
    })(_, context);
  },
]);
