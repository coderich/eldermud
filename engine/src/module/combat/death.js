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
      actor.abortAllStreams(null);
      const info = await actor.mGet('exp');
      const killerCount = killers.length || 1;
      const exp = Math.ceil(info.exp / killerCount);

      // Broadcast to room that actor is dead
      await actor.broadcast('text', actor.slain);

      // Award XP
      await Promise.all(killers.map(killer => killer.perform('expGain', { exp })));
    }

    return actor.perform('death');
  },
]);

Action.define('death', [
  async (_, { actor }) => {
    actor.removeAllPossibleListeners(null);
    const room = CONFIG.get(await actor.get('room'));
    room.units.delete(actor);

    if (actor.type === 'player') {
      const { deathpoint, mhp, mma } = await actor.mGet('deathpoint', 'mhp', 'mma');
      await actor.save({ hp: mhp, ma: mma, room: deathpoint, exp: 0 });
      await actor.send('text', 'You have fallen...');
      return actor.perform('spawn');
    }

    return actor.perform('destroy');
  },
]);
