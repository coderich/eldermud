module.exports = {
  name: 'Bandit',
  depiction: 'A rough-looking individual with shifty eyes and a tattered cloak.',
  description: 'Bandits are outlaws who hide out in forests and wilderness areas, making a living by robbing travelers, merchants, and sometimes even entire villages. They are typically armed and can be dangerous, especially in groups.',
  slain: 'The bandit slumps to the ground, a final gasp escaping their lips as their eyes go dark.',
  str: 13,
  dex: 11,
  int: 10,
  wis: 9,
  con: 12,
  cha: 8,
  stealth: '10d10',
  random: {
    ranks: [
      'Thug',
      'Outlaw',
      'Highwayman',
      'Raider',
    ],
    impressions: [
      'Scraggly',
      'Filthy',
      'Menacing',
      'Cunning',
    ],
    movements: [
      'Lurk',
      'Pounce',
      'Ambush',
      'Flee',
    ],
  },
  traits: ['${self:trait.lifeforce}', '${self:trait.hunter}'],
  // attacks: [
  //   '${self:weapon.scimitar}',
  //   '${self:weapon.dagger}',
  //   '${self:weapon.crossbow}',
  // ],
  // traits: [
  //   '${self:trait.skulker}',
  //   '${self:trait.toughness}',
  // ],
  // abilities: [
  //   '${self:ability.sneakAttack}',
  //   '${self:ability.hideInPlainSight}',
  // ],
};
