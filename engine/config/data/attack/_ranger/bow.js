module.exports = {
  name: 'Bow',
  depiction: 'A polished yew wood bow with a carved riser and sinew backing binding the limbs.',
  description: 'A classic wooden bow handcrafted for balanced draw weight, offering solid range and accuracy for skilled archers.',
  dmg: '2d8',
  acc: 3,
  crits: 0,
  range: 5,
  scale: { str: 0.3, dex: 0.6 },
  hits: ['pierce', 'thrust', 'strike'],
  misses: ['twang', 'drop', 'miss'],
};
