module.exports = {
  name: 'Staff of the Arcane Savant',
  depiction: 'An ornate staff crowned with a crystal that pulses with raw magical energy',
  description: 'This ancient staff is said to channel the very essence of magic. It allows an Archmage to cast devastating spells with amplified power, commanding the forces of the elements at their will. The staff not only serves as a conduit for existing spells but also enables the forging of new arcane wonders.',
  dmg: '3d10+5',
  range: '3',
  speed: 5,
  hits: [
    'engulf',
    'blast',
    'disintegrate',
  ],
  misses: [
    'fizzle',
    'miss',
    'whiff',
  ],
  scales: {
    str: 0.1,
    dex: 0.5,
    int: 2,
    wis: 0.5,
    con: 0.1,
    cha: 0.3,
  },
};
