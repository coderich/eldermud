module.exports = {
  code: 'psho',
  name: 'PowerShot',
  description: 'Focus a blistering arrow with increased damage and critical chance',
  cost: 10,
  range: 5,
  speed: 2000,
  target: 'creature',
  gesture: 'focus blistering arrow',
  effects: [
    { style: 'hit', target: 'target', affect: { hp: '-10d10+100' } },
  ],
};
