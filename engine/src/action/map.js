const { Action } = require('@coderich/gameflow');

const coords = {
  n: [0, 2, 0],
  s: [0, -2, 0],
  e: [2, 0, 0],
  w: [-2, 0, 0],
};

Action.define('map', async (_, { actor }) => {
  const map = Config.get('data.map.dungeon');
  const $actor = await DB.get(actor.id);

  const rooms = Object.entries(map).reduce((arr, [key, value], i) => {
    return arr.concat({
      id: i + 1,
      key,
      name: value.name,
      x: 0,
      y: 0,
      z: 0,
    });
  }, []);

  const exits = Object.values(map).reduce((arr, room, i) => {
    const id = i + 1;

    return arr.concat(Object.entries(room.exits).reduce((obj, [dir, exit]) => {
      // const [root, key] = exit.split('.');
      // const target = root === 'Room' ? exit : Doors[key].connects[dir];
      const target = exit;
      const thisRoom = rooms.find(el => el.id === id);
      const nextRoom = rooms.find(el => el.key === target);

      if (!nextRoom) return obj;

      if (nextRoom.id > id) {
        const [x, y, z] = coords[dir];
        nextRoom.x = thisRoom.x + x;
        nextRoom.y = thisRoom.y + y;
        nextRoom.z = thisRoom.z + z;
      }
      return Object.assign(obj, { [dir]: nextRoom.id });
    }, {}));
  }, []);

  const room = rooms.find(el => el.key === $actor.room).id;

  actor.socket.emit('map', {
    name: 'Eldermud',
    room,
    rooms,
    exits,
  });
});
