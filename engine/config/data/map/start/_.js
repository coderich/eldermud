const FS = require('fs');
const Path = require('path');
const { randomUUID } = require('crypto');
const Util = require('@coderich/util');
const Get = require('lodash.get');

const noop = ({ promise }) => promise.abort();

const intro = [
  'Your thoughts slip like oil through your fingers.',
  'You try to move, but your limbs respond like echoes.',
  'Something pulses in the dark. Once... then again. A rhythm.',
  'The shadows bend. One shape lingers longer than the rest.',
  'You are not asleep. You are not whole.',
  'You must awaken...',
];

const spawn = async (actor) => {
  const { config } = CONFIG.toObject();
  const id = randomUUID();
  const map = `map.${id}`;
  const room = `${map}.rooms.triageRoom`;
  const path = Path.resolve(__dirname, '..', `${id}.json`);
  const data = JSON.stringify({ ...Get(config, 'map.eldenfortSanatorium'), id }, null, 2).replaceAll('map.eldenfortSanatorium', map);
  FS.writeFileSync(path, data);
  CONFIG.mergeConfig(Path.resolve(__dirname, '..'), ['map']).decorate();

  // Spawn NPC(s)
  const npc = await APP.instantiate('npc.sisterCaldra');
  await npc.save({ map, room }).then(el => el.perform('spawn'));

  //
  await actor.save({ map, room });
  actor.send('cls');
  actor.perform('map');
  actor.perform('room');
};

SYSTEM.on('enter:map.start.rooms.start', async ({ actor }) => {
  actor.room.units.delete(actor);
  actor.on('pre:execute', noop);

  actor.once('pre:execute', async () => {
    actor.send('text', '');
    await Util.promiseChain(intro.map(line => async () => {
      actor.send('text', APP.styleText('muted', `\t${line}`));
      await APP.timeout(3500);
    }));

    actor.once('pre:execute', async () => {
      actor.off('pre:execute', noop);
      await spawn(actor);
    });
  });
});

SYSTEM.on('post:spawn', (context) => {
  if (context.actor.id === 'sisterCaldra') {
    SYSTEM.on(`greet:${context.actor}`, ({ actor }) => {
      actor.send('text', 'Yeah yeah yeah');
    });
  }
});
