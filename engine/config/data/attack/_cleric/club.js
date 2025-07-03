module.exports = {
  name: 'Club',
  depiction: 'A rough-hewn hardwood stick, heavy at one end for crushing impact.',
  description: 'A simple blunt weapon that delivers solid crushing damage in close quarters.',
  dmg: '1d8',
  acc: 4,
  crits: 1,
  range: 1,
  scale: { str: 0.7, dex: 0.3 },
  hits: ['smash', 'blunt', 'slam'],
  misses: ['whiff', 'fumble', 'drop'],
};
