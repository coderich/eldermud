export default {
  'object.rope': {
    id: 'object.rope',
    name: 'rope',
    type: 'general',
    cost: 30,
  },
  'object.healthpotion': {
    id: 'object.healthpotion',
    name: 'health potion',
    type: 'potion',
    cost: 15,
    effects: [
      { effect: 'increase-health', roll: '2d5+5', duration: 1 },
    ],
  },
  'object.manapotion': {
    id: 'object.manapotion',
    name: 'mana potion',
    type: 'potion',
    cost: 30,
    effects: [
      { effect: 'increase-mana', roll: '2d5+5', duration: 1 },
    ],
  },
};
