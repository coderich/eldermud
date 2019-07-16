import { roll } from './game.service';
import { getData, setData, pushData } from './data.service';

const makeCreature = async (templateData, initialData) => {
  const now = new Date().getTime();
  const id = `creature.${now}`;
  const hp = roll(templateData.hp);
  const exp = templateData.exp * hp;
  const template = templateData.id;
  const creature = Object.assign({}, templateData, { id, hp, exp, template }, initialData);
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
      const spawn = await makeCreature(boss, { room: room.id });
      await setData(spawn.id, 'spawn', now + boss.respawn);
      await pushData(room.id, 'units', spawn.id);
      spawnCheck(roomId);
      return;
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
      const spawn = await makeCreature(regular, { room: room.id });
      await pushData(room.id, 'units', spawn.id);
      spawnCheck(roomId);
      return;
    }
  }

  // Nothing to do
  room.spawn = new Date().getTime() + room.respawn;
  setTimeout(() => spawnCheck(roomId), room.respawn + 10);
};

const rooms = {};

export const addRoom = (room) => {
  if (!rooms[room.id]) {
    rooms[room.id] = room;

    if (room.spawn) spawnCheck(room.id);
  }
};

export const removeRoom = (room) => {

};
