import { roll } from './game.service';
import { getData, setData, pushData, incData } from './data.service';

const spawnCreature = async (templateData, initialData) => {
  const now = new Date().getTime();
  const id = `creature.${now}`;
  const hp = roll(templateData.hp);
  const exp = templateData.exp * hp;
  const template = templateData.id;
  const creature = Object.assign({}, templateData, { id, hp, exp, template }, initialData);
  await pushData(creature.room, 'units', creature.id);
  if (creature.respawn) creature.spawn = now + creature.respawn;
  return setData(id, creature);
};

const spawnCheck = async (roomId) => {
  const room = await getData(roomId);
  const now = new Date().getTime();
  const creatures = await room.Creatures();

  if (creatures.length < room.spawnlings.max && room.spawn <= now) {
    const ids = Object.keys(room.spawnlings.creatures);
    const templates = await Promise.all(ids.map(id => getData(id)));

    // First try for bosses
    const [boss] = templates.filter((t) => {
      const inRoom = creatures.filter(c => c.template === t.id);
      if (!t.spawn) return false;
      if (t.spawn > now) return false;
      if (inRoom.length >= room.spawnlings.creatures[t.id].max) return false;
      return true;
    }).sort((a, b) => a.spawn - b.spawn);

    if (boss) {
      await spawnCreature(boss, { room: room.id });
      return spawnCheck(roomId);
    }

    // Next try for ordinary creatures
    const regulars = templates.filter((t) => {
      const inRoom = creatures.filter(c => c.template === t.id);
      if (t.spawn) return false;
      if (inRoom.length >= room.spawnlings.creatures[t.id].max) return false;
      return true;
    });

    const regular = regulars[Math.floor(Math.random() * regulars.length)];

    if (regular) {
      await spawnCreature(regular, { room: room.id });
      return spawnCheck(roomId);
    }
  }

  // Nothing to do
  await incData(roomId, 'spawn', new Date().getTime() + room.respawn);
  return setTimeout(() => spawnCheck(roomId), room.respawn + 10);
};

const rooms = new Set();

export const addRoom = async (id) => {
  if (!rooms.has(id)) {
    rooms.add(id);
    const room = await getData(id);
    if (room.spawn) spawnCheck(id);
  }
};

export const removeRoom = (id) => {
  rooms.remove(id);
};
