module.exports = {
  // id: 'ant',
  name: 'ant',
  dc: 1,
  ac: 5,
  hp: 3,
  exp: 1,
  adjectives: ['', 'small', 'giant', 'huge', 'fat', 'skinny'],
  moves: ['creep', 'scuttle'],
  attacks: [
    {
      dmg: '1d2',
      acc: '1d20-5',
      spd: 1000,
      type: 'P',
      range: 1,
      hits: ['nibble', 'bite', 'chomp'],
      misses: ['lunge'],
    },
  ],
  roams: false,
  follows: true,
};
