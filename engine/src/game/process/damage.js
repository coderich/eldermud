const { Action } = require('@coderich/gameflow');

Action.define('damage', async ({ target, dmg }, { actor }) => {
  const hp = await REDIS.decrBy(`${target}.hp`, dmg);
  actor.send('text', `You do ${dmg} damage to ${target.name}! (${hp})`);
  // target.socket.emit('text', `${actor.name} does ${dmg} damage to you! (${hp})`);
  // target.perform('hud');
});
