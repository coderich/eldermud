/**
 * Death can be a process (for player) or instant (for creatures)
 */

const { Action } = require('@coderich/gameflow');

SYSTEM.on('post:spawn', async ({ actor }) => {
  const hp = await actor.get('hp');
  actor.$dead = Boolean(hp <= 0);
});

SYSTEM.on('post:affect', (context) => {
  const { actor, result } = context;
  console.log(`${actor}`, result);
  if (result.hp <= 0) actor.perform('death');
});

Action.define('death', () => null);

SYSTEM.on('post:death', async ({ actor }) => {
  if (!actor.$dead) {
    actor.$dead = true;
    const room = CONFIG.get(await actor.get('room'));
    room.units.delete(actor);
    actor.removeAllPossibleListeners();

    switch (actor.type) {
      case 'player': {
        const { deathpoint, mhp, mma } = await actor.mGet('deathpoint', 'mhp', 'mma');
        await actor.save({ hp: mhp, ma: mma, room: deathpoint, exp: 0, posture: 'rest' });
        actor.send('text', 'You have fallen...');
        actor.perform('spawn');
        break;
      }
      default: {
        const { name, lvl, mhp } = await actor.mGet('name', 'lvl', 'mhp');
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
        await APP.instantiate('item.corpse', { room, lvl, mhp, name: `${name} corpse`}).then(corpse => corpse.perform('spawn'));

        // Destroy actor
        await actor.perform('destroy');

        break;
      }
    }
  }
});
