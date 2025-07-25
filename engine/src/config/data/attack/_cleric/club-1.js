module.exports = {
  name: 'Club',
  depiction: 'A rough-hewn hardwood stick, heavy at one end for crushing impact.',
  description: 'A simple blunt weapon that delivers solid crushing damage in close quarters.',
  dmg: '1d4',
  acc: 3,
  crits: 0,
  range: 1,
  speed: 2000,
  recoil: 2000,
  weight: 100,
  scale: { str: 0.25, dex: 0.25 },
  hits: ['smash', 'wallop', 'slam'],
  misses: ['whiff', 'swing', 'swoop'],
  upgrade: {
    cost: 1000,
    next: '${self:attack.club-2}',
  },
};
