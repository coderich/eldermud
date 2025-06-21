module.exports = {
  name: 'Eldric the Wise',
  depiction: 'Eldric is an elderly man with a long, white beard that reaches down to his chest. His eyes are a piercing blue, full of wisdom and curiosity. He wears a simple robe made of rough cloth, dyed in earthy tones, and carries a staff adorned with symbols of ancient runes.',
  description: `
    Eldric is a figure of respect and reverence in the countryside surrounding Eldenfort.
    Known for his vast knowledge and gentle demeanor, he is often seen meditating under the trees or sharing stories with the villagers.
    His presence is a comforting constant in the otherwise unpredictable world.
  `,
  backstory: `
    Eldric was once a scholar of renowned reputation, having studied at the Elden Keep itself.
    After a lifetime spent in the pursuit of knowledge, he retired to the countryside to live a simpler life.
    Over the years, he has become a repository of stories and lore about Eldenfort, often sharing tales of the city's past with anyone who would listen.
    His connection to the city runs deep, and he remains a silent observer of its affairs, always ready to offer guidance to those who seek it.
  `,
  room: '${self:map.eldenfortCountryside.rooms.hermitHaven}',
  str: 13,
  dex: 11,
  int: 10,
  wis: 9,
  con: 12,
  cha: 8,
  exp: 1,
  lvl: 1,
  traits: [
    '${self:trait.sanctuary}',
  ],
  // quests: [
  //   '${self:quest.echosOfTheAncients}',
  // ],
};
