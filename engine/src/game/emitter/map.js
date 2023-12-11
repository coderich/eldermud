const { Action } = require('@coderich/gameflow');

const { coords } = CONFIG.get('action.map');

Action.define('map', async (_, { actor }) => {
  const [dbMap, dbRoom] = await REDIS.mGet([`${actor}.map`, `${actor}.room`]);
  const [configMap, configRoom] = [CONFIG.get(dbMap), CONFIG.get(dbRoom)];

  // Convert to array of rooms
  const rooms = Object.values(configMap.rooms).map(({ id, name }, i) => ({ id: i + 1, key: id, name, x: 0, y: 0, z: 0 }));

  // Find exists
  const exits = Object.values(configMap.rooms).map((room, i) => {
    const id = i + 1;

    return Object.entries(room.exits).reduce((prev, [dir, exit]) => {
      const $room = rooms.find(el => el.id === id);
      const $exit = rooms.find(el => el.key === exit.id);

      if ($exit.id > id) {
        const [x, y, z] = coords[dir];
        $exit.x = $room.x + x;
        $exit.y = $room.y + y;
        $exit.z = $room.z + z;
      }

      return Object.assign(prev, { [dir]: $exit.id });
    }, {});
  });

  // Room id you're currently in
  const room = rooms.find(el => el.key === configRoom.id).id;

  // Emit to the world
  actor.socket.emit('map', { name: configMap.name, room, rooms, exits });
});
