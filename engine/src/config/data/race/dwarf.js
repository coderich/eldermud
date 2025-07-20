module.exports = {
  name: 'Dwarf',
  depiction: 'A stocky, bearded figure clad in sturdy armor etched with ancestral runes.',
  description: 'Dwarves hail from mountain strongholds, known for their resilience, craftsmanship, and unbreakable will. They endure what others cannot and stand firm in the face of any foe.',
  str: 1,
  dex: -1,
  int: 0,
  wis: 0,
  con: 1,
  cha: -1,
  gains: { str: 1, dex: 0, int: 0, wis: 1, con: 0, cha: 0 },
  traits: [
    '${self:trait.resilient}',
  ],
  talents: [
    '${self:talent.battlecry-1}',
  ],
};
