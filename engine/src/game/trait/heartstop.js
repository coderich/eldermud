const { Action } = require('@coderich/gameflow');

const heartstop = ({ promise }) => promise.abort();
const heartbeat = ({ actor }) => actor.off('start:heartbeat', heartstop);
const heartattack = ({ actor }) => actor.on('start:heartbeat', heartstop);

Action.define('heartstop', [
  (_, { actor }) => {
    REDIS.get(`${actor}.room`).then(room => CONFIG.get(`${room}`)).then((room) => {
      SYSTEM.on(`enter:${room}`, heartattack);
      SYSTEM.on(`leave:${room}`, heartbeat);
      Array.from(room.units.values()).filter(unit => unit !== actor).forEach((unit) => {
        unit.on('start:heartbeat', heartstop);
      });
    });

    actor.once('post:move', ({ result }) => {
      const { room } = result;
      SYSTEM.off(`enter:${room}`, heartattack);
      SYSTEM.off(`leave:${room}`, heartbeat);
      room.units.forEach(unit => unit.off('start:heartbeat', heartstop));
      actor.stream('trait', 'heartstop');
    });
  },
]);
