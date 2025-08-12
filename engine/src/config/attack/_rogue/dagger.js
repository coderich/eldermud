// module.exports = {
//   name: 'Dagger',
//   depiction: 'A small, sharp blade suitable for swift strikes or throwing',
//   description: 'Lightweight and easy to conceal, this dagger excels at precise hits.',
//   dmg: '2d4',
//   acc: 5,
//   crits: 1,
//   range: 1,
//   scale: { str: 0.3, dex: 0.5 },
//   hits: ['stab', 'pierce', 'nick'],
//   misses: ['fumble', 'drop', 'miss'],
// };

module.exports = {
  name: 'Dagger',
  depiction: 'A combat dagger with a gleaming steel blade honed to a razor-sharp edge.',
  description: 'A finely crafted dagger that delivers deeper wounds with superior craftsmanship.',
  dmg: '1d6',
  acc: 3,
  crits: 2,
  range: 1,
  speed: 2000,
  scale: { str: 0.25, dex: 0.25 },
  hits: ['pierce', 'slice', 'stab'],
  misses: ['stab', 'miss'],
};
