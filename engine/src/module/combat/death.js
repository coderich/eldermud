/**
 * Death can be a process (for player) or instant (for creatures)
 */

const { Action } = require('@coderich/gameflow');

SYSTEM.on('post:spawn', ({ actor }) => {
  actor.$dead = Boolean(actor.hp <= 0);
});

SYSTEM.on('post:affect', (context) => {
  const { actor, result } = context;
  if (result.hp <= 0) actor.perform('death');
});

Action.define('death', () => null);

SYSTEM.on('post:death', async ({ actor }) => {
  if (!actor.$dead) {
    actor.$dead = true;
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
        const exp = Math.ceil((actor.mhp * actor.exp) / actor.$killers.size);

        actor.$killers.forEach((killer) => {
          killer.perform('affect', { exp });
          killer.send('text', `You gain ${APP.styleText('keyword', exp)} soul power.`);
          killer.perform('room');
        });

        // Redis cleanup
        const keys = await REDIS.keys(`${actor}.*`);
        await REDIS.del(keys);

        break;
      }
    }
  }
});
