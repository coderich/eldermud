module.exports = {
  name: 'Rod',
  depiction: 'A small, sharp blade suitable for swift strikes or throwing',
  description: 'Lightweight and easy to conceal, this dagger excels at precise hits.',
  dmg: '2d4',
  acc: 3,
  crits: 0,
  range: 1,
  scale: { str: 0.25, dex: 0.25 },
  hits: ['stab', 'pierce', 'nick'],
  misses: ['fumble', 'drop', 'miss'],
};
