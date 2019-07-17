import { delay, map, mergeMap, retry } from 'rxjs/operators';
import { getData, setData, pushData } from './data.service';
import { createAction, writeStream } from './stream.service';
import { roll } from './game.service';

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

const balk = () => { throw new Error(); };

const loop = roomId => createAction(
  mergeMap(async () => {
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
        balk();
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
        balk();
      }
    }
  }),
  delay(3000),
  map(() => balk()),
  retry(),
);

const rooms = new Set();

export const addRoom = async (id) => {
  if (!rooms.has(id)) {
    rooms.add(id);
    const room = await getData(id);
    if (room.spawn) writeStream(id, loop(id));
  }
};

export const removeRoom = (id) => {
  rooms.remove(id);
  writeStream(id, 'abort');
};
