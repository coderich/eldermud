const FS = require('fs');
const Path = require('path');
const { randomUUID } = require('crypto');
const Get = require('lodash.get');
const Item = require('../../../../src/model/Item');
const NPC = require('../../../../src/model/NPC');

const noop = ({ abort }) => abort();
const startRoom = 'triageRoom';
const onboardRoom = 'wardingChamber';

// Create a new map/instance
SYSTEM.on(`teleport:map.eldenfortSanatorium.rooms.${startRoom}`, async ({ actor }) => {
  const { config } = CONFIG.toObject();
  const id = randomUUID();
  const map = `map.${id}`;
  const path = Path.resolve(__dirname, '..', `${id}.json`);
  const data = JSON.stringify({ ...Get(config, 'map.eldenfortSanatorium'), id }, null, 2).replaceAll('map.eldenfortSanatorium', map);
  FS.writeFileSync(path, data);
  CONFIG.mergeConfig(Path.resolve(__dirname, '..'), ['map']).decorate();

  // Spawn NPC(s) + teleport actor
  const room = CONFIG.get(`${map}.rooms.${startRoom}`);
  const npc = await APP.instantiate('npc.sisterCaldra');
  await npc.save({ room }).then(el => el.perform('spawn'));
  await actor.save({ checkpoint: room });
  await actor.perform('teleport', { room });
});

// Setup Sister Caldra experience...
SYSTEM.on('post:spawn', async (context) => {
  if (context.actor.id === 'sisterCaldra') {
    const npc = context.actor;
    let room = CONFIG.get(await npc.get('room'));
    const [map] = `${room}`.split('.rooms');

    SYSTEM.on(`enter:${map}.rooms.${startRoom}`, async ({ actor }) => {
      if (actor.type === 'player' && !actor.$sisterCaldra && `${room}` === `${map}.rooms.${startRoom}`) {
        actor.$sisterCaldra = true;
        actor.once('post:death', () => {
          delete actor.$sisterCaldra;
          // actor.offFunction(noop);
        });

        await APP.timeout(1000);
        await actor.send('text', `${npc.name} (to you):`, APP.styleText('dialog', "You... you're awake? Saints preserve us! I thought the fever took you for sure."));
        await APP.timeout(3000);
        await actor.send('text', `${npc.name} (to you):`, APP.styleBlockText('dialog', [
          { text: 'follow', style: 'gesture' },
        ], "The Plague eats more than flesh - it devours identity. There isn't much time... follow me!"));
        await APP.timeout(2000);
        npc.perform('invite', { target: actor });

        actor.once(`follow:${npc}`, async () => {
          // actor.on('pre:execute', noop);
          const target = CONFIG.get(`${map}.rooms.quarantineHall`);

          if (!target.units.size) {
            const { target: creature } = await APP.instantiate('creature.plagueWretch', { room: target }).then(unit => unit.perform('spawn'));
            await APP.timeout(1500);
            await npc.perform('look', { target, cmd: { code: 'n' } });
            await APP.timeout(1500);
            await actor.send('text', `${npc.name} (to you):`, APP.styleBlockText('dialog', [
              { text: creature.name, style: creature.type },
            ], `${creature.name}... we need to move fast.`));
            await APP.timeout(1000);
            await npc.perform('look', { target, cmd: { code: 'w' } });
          }

          await APP.timeout(1500);
          await npc.stream('action', 'move', 'w');
          await npc.stream('action', 'move', 'w');
        });
      }
    });

    SYSTEM.on(`enter:${map}.rooms.${onboardRoom}`, async ({ actor }) => {
      room = CONFIG.get(await npc.get('room'));

      if (actor.type === 'player' && !actor.$sisterCaldra2 && `${room}` === `${map}.rooms.${onboardRoom}`) {
        actor.$sisterCaldra2 = true;
        room.items = new Set();
        // actor.on('pre:execute', noop);
        actor.once('post:death', () => {
          delete actor.$sisterCaldra2;
          // actor.offFunction(noop);
        });
        await APP.timeout(3000);
        actor.send('text', APP.styleText('boost', `${npc.name} makes a sweeping gesture...`));
        await APP.timeout(2000);
        actor.send('text', APP.styleText('debuff', 'The runes on the floor begin to glow bright red!'));
        await APP.timeout(2000);
        // await actor.perform('selectClass');
        await Promise.all(Object.values(CONFIG.get('class')).map((echo) => {
          return new NPC({ ...CONFIG.get('npc.archetype'), name: `${echo.name}`, room, echo }).perform('spawn');
        }));
      }
    });
  }
});
