module.exports = {
  name: 'Crystal',
  depiction: 'A small, sharp blade suitable for swift strikes or throwing',
  description: 'Lightweight and easy to conceal, this dagger excels at precise hits.',
  dmg: '2d4',
  acc: 5,
  crits: 1,
  range: 1,
  scale: { str: 0.3, dex: 0.5 },
  hits: ['stab', 'pierce', 'nick'],
  misses: ['fumble', 'drop', 'miss'],
};
