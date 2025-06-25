module.exports = {
  name: 'light crossbow',
  depiction: 'A compact crossbow that fires bolts with deadly accuracy',
  description: 'This weapon fires metal bolts at medium ranges, ideal for ambushes.',
  dmg: '1d8',
  acc: 0,
  crits: 0,
  range: 2,
  scale: { str: 0.2, dex: 1, con: 0.2 },
  hits: ['thunk', 'pierce', 'bolt strike'],
  misses: ['click', 'misfire', 'bolt falls short'],
};
