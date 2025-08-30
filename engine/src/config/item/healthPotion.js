module.exports = {
  name: 'Health Potion',
  depiction: 'This sturdy rope is made from braided nylon fibers, offering exceptional strength and durability. Each end of the rope is equipped with a metal hook, allowing it to be attached to anchors or other fixed points.',
  description: 'A sturdy rope designed for climbing and traversing vertical surfaces.',
  target: 'self',
  value: 1,
  weight: 20,
  pipeline: [
    {
      target: 'target',
      action: 'effect',
      style: 'buff',
      affect: { hp: '2d5+2' },
      message: 'You recover {affect.hp} health',
    },
  ],
};
