module.exports = {
  name: 'Health Potion',
  depiction: 'This sturdy rope is made from braided nylon fibers, offering exceptional strength and durability. Each end of the rope is equipped with a metal hook, allowing it to be attached to anchors or other fixed points.',
  description: 'A sturdy rope designed for climbing and traversing vertical surfaces.',
  value: 50,
  weight: 20,
  effects: [
    {
      style: 'buff',
      target: 'target',
      affect: { hp: 5 },
      message: '{actor.name} {restore} {affect.hp} health',
    },
  ],
};
