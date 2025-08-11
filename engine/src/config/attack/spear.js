module.exports = {
  name: 'Spear',
  depiction: 'A long ash shaft tipped with a leaf-shaped steel head, built for reach and rank-fighting.',
  description: 'A balanced reach weapon that delivers precise piercing thrusts from just outside sword range.',
  dmg: '1d6',
  acc: 2,
  crits: 1,
  range: 2,
  speed: 2000,
  scale: { str: 0.25, dex: 0.25 },
  hits: ['thrust', 'pierce', 'impale'],
  misses: ['swish', 'whiff', 'graze'],
};
