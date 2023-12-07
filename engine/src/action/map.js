const { Action } = require('@coderich/gameflow');

const { coords } = Config.get('action.map');

Action.define('map', async (_, { actor }) => {
  const [actorMap, actorRoom] = await Redis.mGet([`${actor}.map`, `${actor}.room`]);
  const map = Config.get(`data.${actorMap}`);

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

  const room = rooms.find(el => el.key === actorRoom).id;

  actor.socket.emit('map', {
    name: 'Eldermud',
    room,
    rooms,
    exits,
  });
});
