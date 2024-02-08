module.exports = {
  name: 'Necromancer',
  depiction: 'A dark sorcerer shrouded in tattered robes, commanding a horde of undead minions that rise from the soil at their command.',
  description: 'Necromancers are practitioners who defy the natural order, invoking taboo rituals to summon and control the undead, prolong their existence, and spread decay.',
  str: 10,
  dex: 10,
  int: 16,
  wis: 13,
  con: 13,
  cha: 12,
  attacks: ['${self:attack.necromanticGrasp}'],
  traits: [
    '${self:trait.lifeforce}',
    '${self:trait.manaforce}',
    // '${self:trait.deathlyCommand}',
    // '${self:trait.spiritSiphon}',
    // '${self:trait.lichAscension}',
  ],
  talents: [
    // '${self:talent.bonecraft}',
    // '${self:talent.undeathAura}',
    // '${self:talent.plagueArrow}',
  ],
};
