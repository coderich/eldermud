module.exports = {
  code: 'call',
  name: 'WarCall',
  description: 'Rally all party members; gain HP+5 and boost { STR+5 DEX+3 } for it\'s duration',
  target: 'self',
  style: 'buff',
  speed: 500,
  cooldown: 60000,
  affect: { ma: -5 },
  effects: [
    { type: 'buff', target: 'party', affect: { hp: 5 } }, // Bolstered
    { type: 'buff', target: 'party', effect: { str: 5, dex: 3 }, duration: 20000 }, // Bolstered
    { type: 'debuff', target: 'enemies', effect: { str: -2, dex: -5 }, duration: 10000 }, // Startled
  ],
};
