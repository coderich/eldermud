module.exports = {
  name: 'Eclipse Strike',
  depiction: 'A silhouetted blade enveloped in creeping darkness, leaving a trace of umbral chill as it slashes through the air.',
  description: "The Eclipse Strike is an embodiment of the ShadowCaster's power, a strike that severs the connection between light and shadow. When unleashed, the attack engulfs the target in a penumbral aura, dimming the lights and chilling the hearts of those who witness it.",
  dmg: '2d8+6',
  range: '2',
  speed: 5,
  hits: [
    'sever',
    'shroud',
    'ensnare',
  ],
  misses: [
    'whisper',
    'flicker',
    'recede',
  ],
  scales: {
    str: 0.5,
    dex: 1,
    int: 1.5,
  },
};
