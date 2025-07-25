module.exports = {
  name: 'Necromancer',
  pri: 'int',
  str: 6,
  dex: 8,
  int: 12,
  wis: 4,
  crit: 0,
  dodge: 0,
  talents: ['${self:talent.vamp}', '${self:talent.tlif}'],
  traits: ['${self:trait.manaforce}', '${self:trait.terrifying}'],
  attacks: ['${self:attack.staff}'],
  description: 'Necromancers wield the dark arts, commanding the forces of death. Masters of necromancy, they summon undead minions, cast curses, and drain life to dominate their foes.',
};
