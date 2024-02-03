module.exports = {
  name: 'Necromantic Grasp',
  depiction: 'A spectral hand emerging from a swirl of dark mist, its fingers twitching with necrotic energy',
  description: "This ghastly attack allows the necromancer to channel the energies of the undeath to inflict necrotic damage and possibly gain control over the life-force of their victim, tethering their soul to the necromancer's will.",
  dmg: '1d10+5',
  range: '3',
  speed: 2,
  hits: [
    'siphon',
    'drain',
    'wither',
  ],
  misses: [
    'miss',
    'graze',
    'whiff',
  ],
  scales: {
    int: 0.5,
  },
};
