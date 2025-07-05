module.exports = {
  name: 'Halfling',
  depiction: 'A small, nimble individual with bright eyes and a quick smile, dressed in practical, weather-worn clothing.',
  description: 'Halflings are known for their luck, agility, and cheerful resilience, thriving in both urban and rural environments.',
  str: -1,
  dex: 1,
  int: 1,
  wis: 0,
  con: -1,
  cha: 1,
  gains: { str: 0, dex: 1, int: 0, wis: 0, con: 0, cha: 1 },
  traits: [
    // '${self:trait.luckyFoot}', // passive: once per day, reroll a failed DEX or CHA check
  ],
  talents: [
    // '${self:talent.nimbleDodge}', // active: increase dodge chance by 15% for 5s, costs 4 MP, 30s cooldown
  ],
};
