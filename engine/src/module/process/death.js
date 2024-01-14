const { Action } = require('@coderich/gameflow');

/**
 * We need an action in order to register death events used in attack and below
 */
Action.define('death', () => null);

SYSTEM.on('post:death', async ({ actor }) => {
  actor.perform('break');
  Object.values(actor.streams).forEach(stream => stream.abort() && stream.removeAllListeners());
  CONFIG.get(await REDIS.get(`${actor}.room`)).units.delete(actor);
  actor.removeAllListeners();

  switch (actor.type) {
    case 'player': {
      const { checkpoint } = await actor.mGet(['checkpoint']);
      await actor.calcStats();

      await REDIS.mSet({
        [`${actor}.hp`]: `${actor.mhp}`,
        [`${actor}.ma`]: `${actor.mma}`,
        [`${actor}.room`]: checkpoint,
        [`${actor}.exp`]: '0',
      });

      actor.send('text', 'You have died.');
      actor.perform('spawn');
      break;
    }
    default: {
      const exp = Math.ceil((actor.mhp * actor.exp) / actor.killers.size);

      actor.killers.forEach((killer) => {
        killer.perform('affect', { exp });
        killer.send('text', `You gain ${APP.styleText('keyword', exp)} soul power.`);
      });

      // Redis cleanup
      const keys = await REDIS.keys(`${actor}.*`);
      await REDIS.del(keys);

      break;
    }
  }
});
