const { Action } = require('@coderich/gameflow');

Action.define('damage', async ({ target, dmg }, { actor }) => {
  const hp = await REDIS.decrBy(`${target}.hp`, dmg);
  actor.send('text', `You do ${dmg} damage to ${target.name}! (${hp})`);
  target.send('text', `${actor.name} does ${dmg} damage to you! (${hp})`);
  if (hp <= 0) target.perform('death');
});
