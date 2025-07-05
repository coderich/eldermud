module.exports = {
  name: 'Bandit',
  depiction: 'A rogue human in worn leather armor, dagger at the belt and eyes sharp for an opportunity.',
  description: 'Bandits roam wild roads and forests, ambushing travelers for coin and goods. Agile and cunning, they rely on stealth and quick strikes.',
  slain: 'The bandit staggers back, dropping their weapon before collapsing with a final breath.',

  // Ability scores
  str: 10,
  dex: 12,
  int: 10,
  wis: 10,
  con: 10,
  cha: 10,

  // Combat parameters
  lvl: 3,
  exp: 15,

  // Random flavor tables for variety
  random: {
    ranks: ['Thug', 'Highwayman', 'Raider', 'Cutthroat'],
    impressions: ['Gruff', 'Scarred', 'Wary', 'Greedy'],
    movements: ['Lurk', 'Pounce', 'Ambush', 'Flee'],
  },

  attacks: [
    // '${self:attack.scimitar}',
    '${self:attack.dagger}',
    '${self:attack.sling}',
  ],

  traits: [
    '${self:trait.lifeforce}',
    '${self:trait.manaforce}',
    // '${self:trait.banding}',
    // '${self:trait.tactical}',
    '${self:trait.vagabond}',
    '${self:trait.territorial}',
  ],

  // // Talents for special actions
  // talents: [
  //   '${self:talent.sneakAttack}',
  //   '${self:talent.hideInPlainSight}',
  // ],
};
