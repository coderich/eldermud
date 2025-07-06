module.exports = {
  name: 'Spiked Club',
  depiction: 'A rough-hewn hardwood stick, heavy at one end for crushing impact.',
  description: 'A simple blunt weapon that delivers solid crushing damage in close quarters.',
  dmg: '1d7+3',
  acc: 3,
  crits: 0,
  range: 1,
  speed: 2000,
  recoil: 2000,
  scale: { str: 0.25, dex: 0.25 },
  hits: ['smash', 'wallop', 'slam'],
  misses: ['whiff', 'swing', 'swoop'],
  upgrade: {
    cost: 1000,
    next: '${self:attack.mace-1}',
  },
};
