module.exports = {
  name: 'PowerShot',
  description: 'Focus a blistering arrow with increased damage and critical chance',
  code: 'psho',
  cost: 5,
  range: 5,
  target: 'enemy',
  pipeline: [
    { type: 'wait', duration: 2000 },
    { type: 'debuff', target: 'target', affect: { wis: 5, dex: 5 }, duration: 20000 },
  ],
};
