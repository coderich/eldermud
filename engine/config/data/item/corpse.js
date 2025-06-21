module.exports = {
  name: 'Corpse',
  depiction: 'A still, lifeless body sprawled on the ground. Pale, ashen skin stretches taut over sunken features. Clothing hangs in tatters, and darkened bloodstains mar the fabric. Limbs lie at odd angles, joints stiff with rigor mortis, while insects flit around cracked lips and vacant eye sockets.',
  description: 'A corpse is the dead remains of a once‐living creature. It is the physical body (flesh, bone, and any worn gear) devoid of life, motion, or consciousness, often showing signs of decay or injury.',
  durability: 10,
  traits: [
    '${self:trait.decay}',
    '${self:trait.fixture}',
  ],
};
