module.exports = {
  name: 'Elf',
  depiction: 'A tall, lithe figure with pointed ears, clad in finely woven garments and a keen, perceptive gaze.',
  description: 'Elves are denizens of ancient forests and moonlit glades, known for their agility, keen senses, and attunement to the arcane. They move with grace and strike with deadly precision.',
  str: -1,
  dex: 1,
  int: 1,
  wis: 0,
  con: -1,
  cha: 0,
  gains: { str: 0, dex: 1, int: 1, wis: 0, con: 0, cha: 0 },
  traits: [
    // '${self:trait.nightsGrace}', // passive: once per short rest, become invisible for 10s in dim light areas
  ],
  talents: [
    '${self:talent.feyStep}',
  ],
};
