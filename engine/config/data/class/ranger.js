module.exports = {
  name: 'Ranger',
  depiction: 'A master of ranged combat and wilderness survival, clad in light leathers and carrying a longbow.',
  description: 'Rangers traverse wild places, striking from afar with deadly precision and blending seamlessly into natural surroundings.',
  str: 10,
  dex: 12,
  int: 8,
  wis: 10,
  con: 8,
  cha: 8,
  gains: { str: 1, dex: 2, int: 0, wis: 1, con: 1, cha: 0 },
  armor: '${self:armor.tunic}',
  weapon: '${self:attack.sling}',
  traits: [
    '${self:trait.marksman}',
  ],
  talents: [
    '${self:talent.powershot}',
  ],
  progression: [
    'Sniper ▶ long-range headshots, camouflage, high-crit focus',
    'Pathfinder ▶ stealth scouting, traps, rapid repositioning',
    'Trapper ▶ deployable snares/mines, slowing fields, zone denial',
  ],
};
