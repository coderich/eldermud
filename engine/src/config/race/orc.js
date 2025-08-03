module.exports = {
  name: 'Orc',
  depiction: 'A hulking warrior with greenish skin, tusks protruding from a fierce maw, clad in rough but sturdy armor.',
  description: 'Orcs hail from harsh wastelands, renowned for their brutal strength, ferocity in battle, and enduring constitution.',
  str: 1,
  dex: 0,
  int: -2,
  wis: -2,
  con: 1,
  cha: -1,
  gains: { str: 1, dex: 0, int: 0, wis: 0, con: 1, cha: 0 },
  traits: [
    // '${self:trait.bloodFury}', // passive: when HP falls below 30%, gain +20% melee damage for 5s (120s cooldown)
  ],
  talents: [
    // '${self:talent.berserkerCharge}', // active: charge an enemy, stun for 1s and deal melee damage, costs 6 MP, 20s cooldown
  ],
};
