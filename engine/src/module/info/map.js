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

const toRoom = (room, x, y, z) => ({
  id: room.uid,
  name: room.name,
  char: room.char || '',
  paths: {},
  exits: [],
  x, y, z, // eslint-disable-line
});

const mapRoom = (map, room, x = 0, y = 0, z = 0) => {
  if (!map.has(room)) {
    map.set(room, toRoom(room, x, y, z));

    Object.entries(room.exits || {}).forEach(([dir, exit]) => {
      const coord = coords[dir];
      const $x = x + coord[0]; const $y = y + coord[1]; const $z = z + coord[2];
      if (exit.map === room.map) mapRoom(map, exit, $x, $y, $z);
      else map.set(exit, toRoom(exit, $x, $y, $z));
      map.get(room).exits.push({ id: exit.uid, dir });
    });
  }

  return map.get(room);
};

Action.define('map', async (_, { actor }) => {
  if (actor.type === 'player') {
    const configRoom = CONFIG.get(await actor.get('room'));
    const configMap = CONFIG.get(configRoom.map);
    const map = new Map();
    mapRoom(map, configRoom);
    const rooms = Array.from(map.values());
    actor.send('map', { name: configMap.name, room: configRoom.uid, rooms });
  }
});

// Action.define('map', async (_, { actor }) => {
//   if (actor.type === 'player') {
//     const configRoom = CONFIG.get(await actor.get('room'));
//     const configMap = CONFIG.get(`${configRoom}`.split('.rooms')[0]);

//     // Convert to array of rooms
//     const rooms = Object.values(configMap.rooms).map(({ uid, name, char = '' }) => ({ id: uid, name, char, x: 0, y: 0, z: 0 }));

//     // Append exits (with x,y,x coordinates) to rooms
//     Object.values(configMap.rooms).forEach((room) => {
//       const $room = rooms.find(el => el.id === room.uid);
//       $room.paths = Object.entries(room.paths || {}).reduce((prev, [key, value]) => Object.assign(prev, { [key]: value.status }), {});
//       $room.exits = Object.entries(room.exits || {}).map(([dir, exit]) => {
//         let $exit = rooms.find(el => el.id === exit.uid);

//         // Edge of the map connecting to another...
//         if (!$exit) {
//           $room.paths[dir] ??= 'closed';
//           $exit = { id: $room.id * 1000 };
//         }

//         if ($exit.id > $room.id) {
//           const [x, y, z] = coords[dir];
//           $exit.x = $room.x + x;
//           $exit.y = $room.y + y;
//           $exit.z = $room.z + z;
//         }

//         return { id: $exit.id, dir };
//       });
//     });

//     // Emit
//     actor.send('map', { name: configMap.name, room: configRoom.uid, rooms });
//   }
// });
