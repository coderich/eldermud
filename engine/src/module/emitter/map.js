const { Action } = require('@coderich/gameflow');

const coords = {
  n: [0, 2, 0],
  s: [0, -2, 0],
  e: [2, 0, 0],
  w: [-2, 0, 0],
  ne: [2, 2, 0],
  nw: [-2, 2, 0],
  se: [2, -2, 0],
  sw: [-2, -2, 0],
  u: [0, 0, 2],
  // un: [0, 2, 2],
  // us: [0, -2, 2],
  // ue: [2, 0, 2],
  // uw: [-2, 0, 2],
  // une: [2, 2, 2],
  // unw: [-2, 2, 2],
  // use: [2, -2, 2],
  // usw: [-2, -2, 2],
  d: [0, 0, -2],
  // dn: [0, 2, -2],
  // ds: [0, -2, -2],
  // de: [2, 0, -2],
  // dw: [-2, 0, -2],
  // dne: [2, 2, -2],
  // dnw: [-2, 2, -2],
  // dse: [2, -2, -2],
  // dsw: [-2, -2, -2],
};

Action.define('map', async (_, { actor }) => {
  if (actor.type === 'player') {
    const [dbMap, dbRoom] = await REDIS.mGet([`${actor}.map`, `${actor}.room`]);
    const [configMap, configRoom] = [CONFIG.get(dbMap), CONFIG.get(dbRoom)];

    // Convert to array of rooms
    const rooms = Object.values(configMap.rooms).map(({ mapId, name, char = '' }) => ({ id: mapId, name, char, x: 0, y: 0, z: 0 }));

    // Append exits (with x,y,x coordinates) to rooms
    Object.values(configMap.rooms).forEach((room) => {
      const $room = rooms.find(el => el.id === room.mapId);
      $room.paths = Object.entries(room.paths || {}).reduce((prev, [key, value]) => Object.assign(prev, { [key]: value.status }), {});
      $room.exits = Object.entries(room.exits || {}).map(([dir, exit]) => {
        let $exit = rooms.find(el => el.id === exit.mapId);

        // Edge of the map connecting to another...
        if (!$exit) {
          $room.paths[dir] ??= 'closed';
          $exit = { id: $room.id * 1000 };
        }

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
    actor.send('map', { name: configMap.name, room: configRoom.mapId, rooms });
  }
});
