import { getData } from './data.service';
import { getCoords } from './util.service';

const mapRooms = async (map, room, row, col, size) => {
  if (map[row][col]) return;

  const dirs = Object.keys(room.exits);
  const exits = Object.values(room.exits);
  map[row][col] = { exits: dirs };

  await Promise.all(dirs.map(async (dir, i) => {
    const exit = exits[i];

    // Check for obstacles blocking vision
    if (typeof exit === 'object') {
      const [oids] = Object.values(exit);
      const obstacles = await Promise.all(oids.map(id => getData(id)));

      if (obstacles.some(obstacle => obstacle.blocksVision())) {
        map[row][col].conn = 'blocked';
        return Promise.resolve();
      }
    }

    // Vision is clear - proceed
    const coor = getCoords(row, col, dir);

    if (coor.row < size - 1 && coor.col < size - 1 && coor.row > 0 && coor.col > 0) {
      const nextRoom = await room.Exit(dir);
      return mapRooms(map, nextRoom, coor.row, coor.col, size);
    }

    // Out of bounds
    return Promise.resolve();
  }));
};

export const minimap = async (startRoom, r) => {
  const size = r * 2 + 1;
  const start = Math.floor(size / 2);
  const map = new Array(size).fill(0).map(() => new Array(size).fill(0));
  const world = await getData('map');
  const [key] = Object.entries(world).find(([, value]) => startRoom.id === value.id);
  const [startRow, startCol] = key.split('.');

  for (let row = 0; row < size; row++) {
    const deltaRow = start - row;
    const lookupRow = startRow - deltaRow;

    for (let col = 0; col < size; col++) {
      const deltaCol = start - col;
      const lookupCol = startCol - deltaCol;
      const room = world[`${lookupRow}.${lookupCol}`];
      if (room) map[row][col] = { exits: room.dirs, row: room.row, col: room.col };
    }
  }

  map[start][start].me = true;

  return map;
};

// export const minimap = async (startRoom, r) => {
//   const size = r * 2 + 3;
//   const row = Math.floor(size / 2);
//   const col = Math.floor(size / 2);
//   const map = new Array(size).fill(0).map(() => new Array(size).fill(0));
//   await mapRooms(map, startRoom, row, col, size);
//   map[row][col].me = true;
//   return map;
// };

export const stfu = () => {};
