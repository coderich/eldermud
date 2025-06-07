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
    actor.room.units.delete(actor);
    actor.removeAllPossibleListeners();

    switch (actor.type) {
      case 'player': {
        const { checkpoint } = await actor.mGet(['checkpoint']);
        const [map] = `${checkpoint}`.split('.rooms');
        await actor.calcStats();

        await REDIS.mSet({
          [`${actor}.hp`]: `${actor.mhp}`,
          [`${actor}.ma`]: `${actor.mma}`,
          [`${actor}.map`]: `${map}`,
          [`${actor}.room`]: `${checkpoint}`,
          [`${actor}.exp`]: '0',
        });

        actor.send('text', 'You have died.');
        actor.perform('spawn');
        break;
      }
      default: {
        // const killers = Array.from(actor.$killers).filter(killer => killer.type === 'player');
        // const killerCount = killers.length || 1;
        // const exp = Math.ceil((actor.mhp * actor.exp) / killerCount);

        // Broadcast to room that actor is dead
        actor.broadcast('text', actor.slain);

        // actor.$killers.forEach(async (killer) => {
        //   if (!killer.$dead) {
        //     killer.perform('affect', { exp });
        //     killer.send('text', `You gain ${APP.styleText('keyword', exp)} soul power.`);
        //     killer.perform('room');
        //   }
        // });

        // Create corpse
        await APP.instantiate('item.corpse', {
          room: actor.room,
          name: `${actor.name} corpse`,
        }).then(corpse => corpse.perform('spawn'));

        // Destroy actor
        await actor.perform('destroy');

        break;
      }
    }
  }
});
