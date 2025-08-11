const FS = require('fs');
const Path = require('path');
const { randomUUID } = require('crypto');
const Get = require('lodash.get');

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

    // NPC meets Player
    SYSTEM.on(`enter:${map}.rooms.${startRoom}`, async ({ actor }) => {
      room = CONFIG.get(await npc.get('room'));

      if (`${room}` === `${map}.rooms.${startRoom}`) {
        actor.once('pre:death', () => {
          delete actor.$sisterCaldra;
        });

        if (!actor.$sisterCaldra) {
          actor.$sisterCaldra = true;
          await APP.timeout(1000);
          await npc.perform('cmd', "You... you're awake? Saints preserve us!");
          await APP.timeout(3000);
          await npc.perform('cmd', 'The Plague, it eats more than flesh, it devours identity...');
          await APP.timeout(2000);
          await npc.perform('cmd', `We don't have much time, ${APP.styleText('keyword', 'follow')} me!`);
        }

        await APP.timeout(1500);
        await npc.perform('cmd', `invite ${actor.name}`);

        actor.once(`follow:${npc}`, async () => {
          const target = CONFIG.get(`${map}.rooms.quarantineHall`);

          if (!target.units.size) {
            const { target: creature } = await APP.instantiate('creature.plagueWretch', { room: target }).then(unit => unit.perform('spawn'));
            await APP.timeout(1500);
            await npc.perform('look', { target, cmd: { code: 'n' } });
            await APP.timeout(1500);
            await actor.send('text', `${APP.styleText(npc.type, npc.name)}:`, APP.styleBlockText('text', [
              { text: creature.name, style: creature.type },
            ], `${creature.name}... we need to move fast.`));
            await APP.timeout(1000);
            await npc.perform('look', { target, cmd: { code: 'w' } });
          }

          await APP.timeout(1500);
          await npc.stream('action', 'move', 'w');
          await APP.timeout(1500);
          await npc.stream('action', 'move', 'w');
        });
      }
    });

    // Player onboarding
    SYSTEM.on(`enter:${map}.rooms.${onboardRoom}`, async ({ actor }) => {
      room = CONFIG.get(await npc.get('room'));

      if (actor.type === 'player' && !actor.$sisterCaldra2 && `${room}` === `${map}.rooms.${onboardRoom}`) {
        actor.$sisterCaldra2 = true;
        room.items = new Set();
        actor.once('pre:death', () => {
          delete actor.$sisterCaldra2;
        });
        await APP.timeout(3000);
        actor.send('text', APP.styleText('boost', `${npc.name} makes a sweeping gesture...`));
        await APP.timeout(2000);
        actor.send('text', APP.styleText('debuff', 'The runes on the floor begin to glow bright red!'));
        await APP.timeout(2000);
        await actor.perform('onboard');
        CONFIG.set(`${map}.rooms.entryDoor.exits.w`, CONFIG.get('map.eldenfortChapel.rooms.altar'));
        await actor.perform('map');
        // await actor.perform('selectClass');
        // await Promise.all(Object.values(CONFIG.get('class')).map((echo) => {
        //   return new NPC({ ...CONFIG.get('npc.archetype'), name: `${echo.name}`, room, echo }).perform('spawn');
        // }));
      }
    });
  }
});
