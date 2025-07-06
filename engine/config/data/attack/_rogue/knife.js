module.exports = {
  name: 'Knife',
  depiction: 'A compact dagger with a slim blade and handle designed for concealed carry in a boot.',
  description: 'Balanced for both throwing and precise melee strikes, favored for quick-draw situations.',
  dmg: '1d6',
  acc: 4,
  crits: 1,
  range: 1,
  speed: 2000,
  scale: { str: 0.25, dex: 0.55 },
  hits: ['stab', 'slice', 'nick'],
  misses: ['drop', 'fumble', 'miss'],
};
