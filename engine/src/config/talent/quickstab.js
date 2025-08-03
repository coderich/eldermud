module.exports = {
  code: 'stab',
  name: 'QuickStab',
  description: 'Quickly strike your opponent with increased critical chance',
  cost: 5,
  crits: 5,
  target: 'target',
  effects: [
    { type: 'debuff', target: 'target', affect: { hp: '-2d8' } },
  ],
};
