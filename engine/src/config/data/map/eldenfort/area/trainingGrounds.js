module.exports = {
  rooms: {
    thePit: {
      name: 'The Pit',
      terrain: 'urban',
      description: 'The Market Square is a hive of activity, where vendors from all around come to sell their wares. The scent of fresh bread and herbs permeates the air, and the sound of haggling fills the ears. The Elden Keep can be glimpsed to the north.',
      exits: {
        n: '${self:map.eldenfort.rooms.chapelRoad}',
      },
    },
  },
};
