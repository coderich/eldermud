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
  if (row < size && col < size && row > -1 && col > -1) {
    map[row][col] = { exits: [] };

    Object.keys(room.exits).forEach((dir) => {
      const coor = getCoords(row, col, dir);

      // Push only the exits within range
      if (coor.row < size && coor.col < size && coor.row > -1 && coor.col > -1) {
        map[row][col].exits.push(dir);
      }
    });

    const rooms = await Promise.all(map[row][col].exits.map(dir => room.Exit(dir)));

    return Promise.all(rooms.map((nextRoom, i) => {
      const coor = getCoords(row, col, map[row][col].exits[i]);
      if (!map[coor.row][coor.col]) return mapRooms(map, nextRoom, coor.row, coor.col, size);
      return null;
    }));

    // // Get all the new rooms within range (that haven't been mapped)
    // const exits = await Promise.all(map[row][col].exits.filter((dir) => {
    //   const coor = getCoords(row, col, dir);
    //   return map[coor.row][coor.col] === 0;
    // }).map(async (dir) => {
    //   const exit = await room.Exit(dir);
    //   return { exit, dir };
    // }));

    // return Promise.all(exits.map(({ exit, dir }) => {
    //   const coor = getCoords(row, col, dir);
    //   return mapRooms(map, exit, coor.row, coor.col, size);
    // }));
  }

  return map;
};

export const minimap = async (startRoom, r) => {
  const size = r * 2 + 1;
  const row = Math.floor(size / 2);
  const col = Math.floor(size / 2);
  const map = new Array(size).fill(0).map(() => new Array(size).fill(0));
  await mapRooms(map, startRoom, row, col, size);
  map[row][col].here = true;
  // return map.filter(line => !line.every(v => v === 0));
  return map;
};

export const stfu = () => {};
