module.exports = {
  name: 'rat',
  dc: 1,
  ac: 8,
  hp: 9,
  exp: 1,
  tier: '1d3-1',
  tiers: ['baby', '', 'adult'],
  adjectives: ['', 'small', 'giant', 'huge', 'fat', 'skinny', 'angry'],
  moves: ['creep', 'scuttle', 'wobble'],
  traits: ['heartbeat', 'territorial'],
  attacks: [
    {
      dmg: '1d3',
      acc: '1d20',
      spd: 1000,
      type: 'P',
      range: 1,
      hits: ['claw', 'scratch'],
      misses: ['swipe'],
    },
    {
      dmg: '1d6+1',
      acc: '1d20',
      spd: 1000,
      type: 'P',
      range: 1,
      hits: ['gnaw', 'bite', 'chomp'],
      misses: ['snap', 'lunge'],
    },
  ],
  roams: true,
  follows: false,
};