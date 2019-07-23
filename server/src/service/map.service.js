const getCoords = (row, col, dir) => {
  switch (dir) {
    case 'n': { row--; break; }
    case 's': { row++; break; }
    case 'e': { col++; break; }
    case 'w': { col--; break; }
    case 'ne': { row--; col++; break; }
    case 'nw': { row--; col--; break; }
    case 'se': { row++; col++; break; }
    case 'sw': { row++; col--; break; }
    default: break;
  }
  return { row, col };
};

const mapRooms = async (map, room, row, col, size) => {
  if (map[row][col]) return;

  map[row][col] = { exits: Object.keys(room.exits) };

  await Promise.all(map[row][col].exits.map(async (dir) => {
    const coor = getCoords(row, col, dir);

    if (coor.row < size && coor.col < size && coor.row > -1 && coor.col > -1) {
      const exit = await room.Exit(dir);
      return mapRooms(map, exit, coor.row, coor.col, size);
    }

    return Promise.resolve();
  }));
};

export const minimap = async (startRoom, r) => {
  const size = r * 2 + 3;
  const row = Math.floor(size / 2);
  const col = Math.floor(size / 2);
  const map = new Array(size).fill(0).map(() => new Array(size).fill(0));
  await mapRooms(map, startRoom, row, col, size - 2);
  map[row][col].here = true;
  return map;
};

export const stfu = () => {};
