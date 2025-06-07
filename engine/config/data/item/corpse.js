module.exports = {
  name: 'corpse',
  description: 'A corpse',
  durability: 10,
  traits: [
    '${self:trait.decay}',
    '${self:trait.fixture}',
  ],
};
