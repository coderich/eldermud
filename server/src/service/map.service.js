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

export const minimap = async (startRoom, ra) => {
  const size = ra * 2 + 1;
  const start = Math.floor(size / 2);
  const map = new Array(size).fill(0).map(() => new Array(size).fill(0));
  const world = await getData('map');
  const [key] = Object.entries(world).find(([, value]) => startRoom.id === value.id);
  const [startRow, startCol, depth] = key.split('.');

  for (let row = 0; row < size; row++) {
    const deltaRow = start - row;
    const lookupRow = startRow - deltaRow;

    for (let col = 0; col < size; col++) {
      const deltaCol = start - col;
      const lookupCol = startCol - deltaCol;
      const room = world[`${lookupRow}.${lookupCol}.${depth}`];

      if (room) {
        map[row][col] = {
          row: room.row,
          col: room.col,
          exits: room.dirs.map((dir) => {
            const obj = { dir };
            const { row: r, col: c } = getCoords(lookupRow, lookupCol, dir);
            const d = parseInt(depth, 10);
            const [level, down, up] = [world[`${r}.${c}.${d}`], world[`${r}.${c}.${d - 1}`], world[`${r}.${c}.${d + 1}`]];
            if (level) obj.conn = 'basic';
            if (down) obj.conn = 'stairs:down';
            if (up) obj.conn = 'stairs:up';
            return obj;
          }),
          // exits: room.dirs.reduce((prev, dir) => {
          //   const coords = getCoords(row, col, dir);
          //   const exit = world[`${coords.row}.${coords.col}.${depth}`] || world[`${coords.row}.${coords.col}.${depth - 1}`] || world[`${coords.row}.${coords.col}.${depth + 1}`];

          //   return Object.assign(prev, {
          //     [dir]: {
          //       conn: 'basic',
          //     },
          //   });
          // }, {}),
        };
      }
    }
  }

  map[start][start].me = true;

  return map;
};

export const stfu = () => {};
