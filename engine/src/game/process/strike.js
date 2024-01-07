const { Action } = require('@coderich/gameflow');

Action.define('strike', async ({ target, dmg }, { actor }) => {
  actor.send('text', APP.styleText('hit', `You do ${dmg} damage to ${target.name}!`));
  target.send('text', APP.styleText('hit', actor.type === 'creature' ? 'The' : '', `${actor.name} does ${dmg} damage to you!`));
  const { hp } = await target.perform('affect', { hp: -dmg });
  if (hp <= 0) target.perform('death');
});
