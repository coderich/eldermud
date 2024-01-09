const { Action } = require('@coderich/gameflow');

const heartstop = ({ promise }) => promise.abort();

Action.define('heartstop', [
  (_, { actor }) => {
    REDIS.get(`${actor}.room`).then(room => CONFIG.get(`${room}`)).then((room) => {
      const units = Array.from(room.units.values()).filter(unit => unit.type === 'creature');
      units.forEach(unit => unit.on('start:heartbeat', heartstop));
    });

    actor.once('post:move', ({ result }) => {
      const { room } = result;
      room.units.forEach(unit => unit.off('start:heartbeat', heartstop));
      actor.stream('trait', 'heartstop');
    });
  },
]);
