const { Action } = require('@coderich/gameflow');

/**
 * We need an action in order to register death events used in attack and below
 */
Action.define('death', () => null);

SYSTEM.on('post:death', async ({ actor }) => {
  actor.perform('break');
  CONFIG.get(await REDIS.get(`${actor}.room`)).units.delete(actor);

  switch (actor.type) {
    case 'player': {
      const { mhp, mma, checkpoint } = await actor.mGet(['mhp', 'mma', 'checkpoint']);

      await REDIS.mSet({
        [`${actor}.hp`]: mhp,
        [`${actor}.ma`]: mma,
        [`${actor}.room`]: checkpoint,
        [`${actor}.exp`]: '0',
      });

      actor.send('text', 'You have died.');
      actor.perform('map');
      actor.perform('room');
      actor.perform('status');
      break;
    }
    default: {
      const exp = Math.ceil((actor.mhp * actor.exp) / actor.killers.size);

      actor.killers.forEach((killer) => {
        killer.perform('affect', { exp });
        killer.send('text', `You gain ${APP.styleText('keyword', exp)} soul power.`);
      });

      // Redis cleanup
      actor.removeAllListeners();
      Object.values(actor.streams).forEach(stream => stream.removeAllListeners());
      const keys = await REDIS.keys(`${actor}.*`);
      await REDIS.del(keys);

      break;
    }
  }
});
