import { uniq, flatten } from 'lodash';
import { getData } from './data.service';
import { getCoords } from './util.service';

// const mapRooms = async (map, room, row, col, size) => {
//   if (map[row][col]) return;

//   const dirs = Object.keys(room.exits);
//   const exits = Object.values(room.exits);
//   map[row][col] = { exits: dirs };

//   await Promise.all(dirs.map(async (dir, i) => {
//     const exit = exits[i];

//     // Check for obstacles blocking vision
//     if (typeof exit === 'object') {
//       const [oids] = Object.values(exit);
//       const obstacles = await Promise.all(oids.map(id => getData(id)));

//       if (obstacles.some(obstacle => obstacle.blocksVision())) {
//         map[row][col].conn = 'blocked';
//         return Promise.resolve();
//       }
//     }

//     // Vision is clear - proceed
//     const coor = getCoords(row, col, dir);

//     if (coor.row < size - 1 && coor.col < size - 1 && coor.row > 0 && coor.col > 0) {
//       const nextRoom = await room.Exit(dir);
//       return mapRooms(map, nextRoom, coor.row, coor.col, size);
//     }

//     // Out of bounds
//     return Promise.resolve();
//   }));
// };

export const minimap = async (startRoom, rad) => {
  const size = rad * 2 + 1;
  const start = Math.floor(size / 2);
  const map = new Array(size).fill(0).map(() => new Array(size).fill(0));
  const world = await getData('map');
  const [key] = Object.entries(world).find(([, value]) => startRoom.id === value.id);
  const [startRow, startCol, depth] = key.split('.');

  // Resolve needed data
  const rooms = Object.values(world);
  const obstacleNames = uniq(flatten(rooms.map(room => flatten(Object.values(room.exits).map(obs => flatten(typeof obs === 'object' ? Object.values(obs) : []))))));
  const obstacleData = await Promise.all(obstacleNames.map(name => getData(name)));

  for (let row = 0; row < size; row++) {
    const deltaRow = start - row;
    const lookupRow = startRow - deltaRow;

    for (let col = 0; col < size; col++) {
      const deltaCol = start - col;
      const lookupCol = startCol - deltaCol;
      const lookupRoom = world[`${lookupRow}.${lookupCol}.${depth}`];

      if (lookupRoom && lookupRoom.fov === startRoom.fov) {
        map[row][col] = {
          row: lookupRoom.row,
          col: lookupRoom.col,
          exits: Object.entries(lookupRoom.exits).map(([dir, room]) => {
            const obj = { dir };

            if (typeof room === 'object') {
              const obs = flatten(Object.values(room));
              const obstacles = obs.map(o => obstacleData.find(od => od.id === o));
              obj.conn = obstacles.every(obstacle => obstacle.resolve()) ? 'unblocked' : 'blocked';
            } else {
              const { row: r, col: c } = getCoords(lookupRow, lookupCol, dir);
              const d = parseInt(depth, 10);
              const [level, down, up] = [world[`${r}.${c}.${d}`], world[`${r}.${c}.${d - 1}`], world[`${r}.${c}.${d + 1}`]];
              if (level) obj.conn = 'basic';
              if (down && down.id === room) obj.conn = 'stairs:down';
              if (up && up.id === room) obj.conn = 'stairs:up';
            }

            return obj;
          }),
        };
      }
    }
  }

  map[start][start].me = true;

  return map;
};

export const stfu = () => {};
