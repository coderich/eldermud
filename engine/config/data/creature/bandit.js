module.exports = {
  name: 'Bandit',
  depiction: 'A rogue human in worn leather armor, dagger at the belt and eyes sharp for an opportunity.',
  description: 'Bandits roam wild roads and forests, ambushing travelers for coin and goods. Agile and cunning, they rely on stealth and quick strikes.',
  slain: 'The bandit staggers back, dropping their weapon before collapsing with a final breath.',

  // Ability scores
  str: 12, // Moderate strength for melee
  dex: 14, // High dexterity for stealth and ranged attacks
  int: 10, // Average intelligence
  wis: 10, // Average perception
  con: 13, // Good constitution for endurance
  cha: 10, // Neutral charisma

  // Combat parameters
  exp: 1,
  lvl: 1,
  // ac: 14,                     // Leather armor + Dex
  // hp: '1d8+3',                // Single d8 hit die + Con modifier
  // exp: 25,                    // Experience awarded when defeated
  // lvl: 2,                     // Challenge level
  // size: 1,                    // Medium creature
  // stealth: '1d20+4',          // Stealth roll with Dex bonus

  // Random flavor tables for variety
  random: {
    ranks: ['Thug', 'Highwayman', 'Raider', 'Cutthroat'],
    impressions: ['Gruff', 'Scarred', 'Wary', 'Greedy'],
    movements: ['Lurk', 'Pounce', 'Ambush', 'Flee'],
    // ranks: ['Thug', 'Outlaw', 'Highwayman', 'Raider'],
    // impressions: ['Scraggly', 'Filthy', 'Menacing', 'Cunning'],
    // movements: ['Lurk', 'Pounce', 'Ambush', 'Flee'],
  },

  attacks: [
    '${self:attack.scimitar}',
    '${self:attack.dagger}',
    '${self:attack.lightCrossbow}',
  ],

  traits: [
    '${self:trait.lifeforce}',
    '${self:trait.manaforce}',
    '${self:trait.banding}',
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
