const { Action } = require('@coderich/gameflow');

const coords = {
  n: [0, 2, 0],
  s: [0, -2, 0],
  e: [2, 0, 0],
  w: [-2, 0, 0],
};

Action.define('map', async (_, { actor }) => {
  const [dbMap, dbRoom] = await REDIS.mGet([`${actor}.map`, `${actor}.room`]);
  const [configMap, configRoom] = [CONFIG.get(dbMap), CONFIG.get(dbRoom)];

  // Convert to array of rooms
  const rooms = Object.values(configMap.rooms).map(({ mapId, name, char = '' }) => ({ id: mapId, name, char, x: 0, y: 0, z: 0 }));

  // Append exits (with x,y,x coordinates) to rooms
  Object.values(configMap.rooms).forEach((room) => {
    const $room = rooms.find(el => el.id === room.mapId);
    $room.doors = Object.entries(room.doors || {}).reduce((prev, [key, value]) => Object.assign(prev, { [key]: value.status }), {});
    $room.exits = Object.entries(room.exits).map(([dir, exit]) => {
      const $exit = rooms.find(el => el.id === exit.mapId);

      if ($exit.id > $room.id) {
        const [x, y, z] = coords[dir];
        $exit.x = $room.x + x;
        $exit.y = $room.y + y;
        $exit.z = $room.z + z;
      }

      return { id: $exit.id, dir };
    });
  });

  // Emit
  actor.socket.emit('map', { name: configMap.name, room: configRoom.mapId, rooms });
});
