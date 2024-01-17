SYSTEM.on('post:hit', async ({ actor, result }) => {
  const { attack, dmg } = result;
  if (attack.id === 'vamp') {
    const { hp } = await actor.mGet('hp', 'mhp');
    const incr = Math.min(actor.mhp - hp, dmg);
    actor.perform('affect', { hp: incr });
  }
});

module.exports = {
  name: 'vampiric touch',
  description: 'Vampiric Touch',
  code: 'vamp',
  cost: { ma: -5, exp: -0 },
  dmg: '1d6+1',
  range: 1,
  spd: 2000,
  scale: { int: 1, wis: 0.5 },
  hits: ['drain', 'steal'],
  misses: ['reach', 'grasp'],
};
