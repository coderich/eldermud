module.exports = {
  name: 'Bow',
  depiction: 'A polished yew wood bow with a carved riser and sinew backing binding the limbs.',
  description: 'A classic wooden bow handcrafted for balanced draw weight, offering solid range and accuracy for skilled archers.',
  dmg: '1d8',
  acc: 5,
  crits: 1,
  range: 6,
  scale: { str: 0.3, dex: 0.7 },
  hits: ['pierce', 'thrust', 'strike'],
  misses: ['twang', 'drop', 'miss'],
};
