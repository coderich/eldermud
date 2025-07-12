module.exports = {
  name: 'Blackened Dirk',
  depiction: 'A medium-length thrusting knife coated in dark, oxidized metal to reduce shine.',
  description: 'A sturdier dagger offering extra reach and silence with a non-reflective finish.',
  dmg: '2d6',
  acc: 5,
  crits: 1,
  range: 1,
  speed: 2000,
  scale: { str: 0.35, dex: 0.55 },
  hits: ['thrust', 'impale', 'nick'],
  misses: ['misfire', 'slip', 'miss'],
};
