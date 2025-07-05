/**
 * Death can be a process (for player) or instant (for creatures)
 */

const { Action } = require('@coderich/gameflow');

SYSTEM.on('post:spawn', async ({ actor }) => {
  const hp = await actor.get('hp');
  if (hp <= 0) actor.perform('death');
  else actor.$dead = false;
});

SYSTEM.on('post:affect', (context) => {
  const { actor, result } = context;
  if (result.hp <= 0) actor.perform('death');
});

Action.define('death', async (_, { actor }) => {
  const killers = Array.from(actor.$killers).filter(killer => killer.type === 'player');
  actor.perform('dead');
  actor.removeAllPossibleListeners();
  const room = CONFIG.get(await actor.get('room'));
  room.units.delete(actor);

  switch (actor.type) {
    case 'player': {
      if (!actor.$dead) {
        actor.$dead = true;
        const { deathpoint, mhp, mma } = await actor.mGet('deathpoint', 'mhp', 'mma');
        await actor.save({ hp: mhp, ma: mma, room: deathpoint, exp: 0, posture: 'rest' });
        actor.send('text', 'You have fallen...');
        actor.perform('spawn');
      }
      break;
    }
    default: {
      if (!actor.$dead) {
        actor.$dead = true;
        const info = await actor.mGet('name', 'lvl', 'exp');
        const killerCount = killers.length || 1;
        const exp = Math.ceil((info.lvl * info.exp) / killerCount);

        // Broadcast to room that actor is dead
        await actor.broadcast('text', actor.slain);

        killers.forEach(async (killer) => {
          if (!killer.$dead) {
            killer.perform('affect', { exp });
            killer.send('text', `You collect ${APP.styleText('keyword', exp)} remnants of the dead.`);
          }
        });

        // // Create corpse
        // APP.instantiate('item.corpse', { room, ...info, name: `${info.name} corpse` }).then(corpse => corpse.perform('spawn'));
      }

      // Destroy actor
      actor.perform('destroy');

      break;
    }
  }
});

Action.define('dead', (_, { actor }) => {
});
