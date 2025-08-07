module.exports = {
  code: 'stab',
  name: 'QuickStab',
  description: 'Quickly strike your opponent with increased critical chance',
  cost: 5,
  crits: 5,
  target: 'target',
  cooldown: 5000,
  effects: [
    {
      type: 'hit',
      target: 'target',
      strike: { acc: 1000, crits: 1000, dmg: '2d8', range: 5, hits: ['stab'] },
      // affect: { hp: '-2d8' },
      // message: '{actor.name} quickly {stab} {target.name} for {affect.hp} damage!',
    },
  ],
};
