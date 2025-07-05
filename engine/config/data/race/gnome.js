module.exports = {
  name: 'Gnome',
  depiction: 'A small, quick-witted figure with twinkling eyes and intricate goggles, often tinkering with clocks and arcane devices.',
  description: 'Gnomes are masters of invention and curiosity, blending arcane knowledge with mechanical ingenuity. They explore with bright enthusiasm and leave no puzzle unsolved.',
  str: -1,
  dex: 0,
  int: 1,
  wis: 1,
  con: -1,
  cha: 0,
  gains: { str: 0, dex: 0, int: 1, wis: 1, con: 0, cha: 0 },
  traits: [
    // '${self:trait.tinkersIngenuity}', // passive: once per rest, create a minor gadget (illumination orb, clockwork spider, or minor toolkit)
  ],
  talents: [
    // '${self:talent.arcaneGadget}', // active: deploy a gadget that deals 10 magic damage in a small area, costs 5 MP, 30s cooldown
  ],
};
