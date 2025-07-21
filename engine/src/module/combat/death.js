/**
 * Death can be a process (for player) or instant (for creatures)
 */

const { Actor, Action } = require('@coderich/gameflow');

SYSTEM.on('post:spawn', async ({ actor }) => {
  const hp = await actor.get('hp');
  if (hp <= 0) actor.perform('fallen');
  else actor.$fallen = false;
});

SYSTEM.on('post:affect', (context) => {
  const { actor, result } = context;
  if (result.hp <= 0 && !actor.$fallen) actor.perform('fallen');
});

Action.define('fallen', [
  async (_, { actor }) => {
    actor.$fallen = true;
    const killers = Object.values(Actor).filter(el => el.$target === actor);

    if (actor.type !== 'player') {
      actor.perform('death');
      const info = await actor.mGet('name', 'lvl', 'exp');
      const killerCount = killers.length || 1;
      const exp = Math.ceil((info.lvl * info.exp) / killerCount);

      // Broadcast to room that actor is dead
      await actor.broadcast('text', actor.slain);

      killers.forEach(async (killer) => {
        killer.perform('affect', { exp });
        killer.send('text', `You collect ${APP.styleText('keyword', exp)} remnants of the dead.`);
      });
    } else {
      actor.perform('death');
    }
  },
]);

Action.define('death', [
  async (_, { actor }) => {
    actor.removeAllPossibleListeners(null);
    const room = CONFIG.get(await actor.get('room'));
    room.units.delete(actor);

    if (actor.type === 'player') {
      const { deathpoint, mhp, mma } = await actor.mGet('deathpoint', 'mhp', 'mma');
      await actor.save({ hp: mhp, ma: mma, room: deathpoint, exp: 0, posture: 'rest' });
      actor.send('text', 'You have fallen...');
      return actor.perform('spawn');
    }

    return actor.perform('destroy');
  },
]);
