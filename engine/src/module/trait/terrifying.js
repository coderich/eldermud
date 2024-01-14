const { Action } = require('@coderich/gameflow');

const heartstop = ({ promise }) => promise.abort();
const heartbeat = ({ actor }) => actor.off('start:lifeforce', heartstop);
const heartattack = ({ actor }) => actor.on('start:lifeforce', heartstop);

Action.define('terrifying', [
  (_, { actor }) => {
    actor.on('pre:rest', ({ abort }) => abort(`You are ${APP.styleText('keyword', 'undead')} and find no use in that!`));

    REDIS.get(`${actor}.room`).then(room => CONFIG.get(`${room}`)).then((room) => {
      SYSTEM.on(`enter:${room}`, heartattack);
      SYSTEM.on(`leave:${room}`, heartbeat);
      Array.from(room.units.values()).filter(unit => unit !== actor).forEach((unit) => {
        unit.on('start:lifeforce', heartstop);
      });
    });

    actor.once('post:move', ({ result }) => {
      const { room } = result;
      SYSTEM.off(`enter:${room}`, heartattack);
      SYSTEM.off(`leave:${room}`, heartbeat);
      room.units.forEach(unit => unit.off('start:lifeforce', heartstop));
      actor.stream('trait', 'terrifying');
    });
  },
]);
