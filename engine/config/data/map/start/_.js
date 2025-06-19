const FS = require('fs');
const Path = require('path');
const { randomUUID } = require('crypto');
const Util = require('@coderich/util');
const Get = require('lodash.get');

const noop = ({ promise }) => promise.abort();

const intro = [
  'You try to move, but your limbs respond like echoes.',
  'Something pulses in the dark. Once... then again. A rhythm.',
  'The shadows bend. A single shape lingers longer than the rest.',
  'You are not asleep. You are not whole.',
  'You must awaken...',
];

const spawn = async (actor) => {
  const { config } = CONFIG.toObject();
  const id = randomUUID();
  const map = `map.${id}`;
  const path = Path.resolve(__dirname, '..', `${id}.json`);
  const data = JSON.stringify({ ...Get(config, 'map.eldenfortSanatorium'), id }, null, 2).replaceAll('map.eldenfortSanatorium', map);
  FS.writeFileSync(path, data);
  CONFIG.mergeConfig(Path.resolve(__dirname, '..'), ['map']).decorate();

  // Spawn NPC(s) + teleport actor
  const room = CONFIG.get(`${map}.rooms.triageRoom`);
  const npc = await APP.instantiate('npc.sisterCaldra');
  await npc.save({ room }).then(el => el.perform('spawn'));
  await actor.perform('teleport', { room });
};

SYSTEM.on('enter:map.start.rooms.start', async ({ actor }) => {
  const room = CONFIG.get(await actor.get('room'));
  room.units.delete(actor);
  actor.on('pre:execute', noop);

  actor.once('pre:execute', async () => {
    actor.send('text', '');

    await Util.promiseChain(intro.map((line, i) => async () => {
      actor.send('text', APP.styleText('muted', `\t${line}`));
      if (i < intro.length - 1) await APP.timeout(500);
    }));

    actor.once('pre:execute', async () => {
      actor.off('pre:execute', noop);
      await spawn(actor);
    });
  });
});

SYSTEM.on('post:spawn', (context) => {
  if (context.actor.id === 'sisterCaldra') {
    SYSTEM.on(`enter:${context.actor.room}`, async ({ actor }) => {
      const [map] = `${actor.room}`.split('.rooms');
      await actor.send('text', `${context.actor.name} (to you):`, APP.styleText('dialog', "You... you're awake? Saints preserve us! I thought the fever took you for sure."));
      await APP.timeout(3000);
      await actor.send('text', `${context.actor.name} (to you):`, APP.styleBlockText('dialog', [
        { text: 'stand', style: 'keyword' },
      ], "The Plague eats more than flesh - it devours identity... there isn't much time, can you stand?"));

      actor.once('abort:stand', () => {
        APP.instantiate('creature.plagueWretch', {
          room: `${map}.rooms.quarantineHall`,
        }).then(unit => unit.perform('spawn'));
      });
    });
  }
});
