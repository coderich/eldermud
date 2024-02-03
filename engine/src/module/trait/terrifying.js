const { Action } = require('@coderich/gameflow');

Action.define('terrifying', [
  (_, context) => {
    // These functions must be defined in the context of the actor
    const heartstop = ({ promise }) => promise.abort();
    const heartbeat = ({ actor }) => actor.off('start:lifeforce', heartstop);
    const heartattack = ({ actor }) => actor.on('start:lifeforce', heartstop);

    // The abort-trait handler
    context.stream.on('abort', () => {
      SYSTEM.offFunction(heartbeat);
      SYSTEM.offFunction(heartattack);
      context.actor.room.units.forEach(target => target.offFunction(heartstop));
    });

    REDIS.get(`${context.actor}.room`).then(room => CONFIG.get(`${room}`)).then((room) => {
      SYSTEM.on(`enter:${room}`, heartattack);
      SYSTEM.on(`leave:${room}`, heartbeat);
      Array.from(room.units.values()).filter(unit => unit !== context.actor).forEach((unit) => {
        unit.on('start:lifeforce', heartstop);
      });
    });

    context.actor.once('post:move', ({ result }) => {
      const { room } = result;
      SYSTEM.off(`enter:${room}`, heartattack);
      SYSTEM.off(`leave:${room}`, heartbeat);
      room.units.forEach(unit => unit.off('start:lifeforce', heartstop));
      context.actor.stream('trait', 'terrifying');
    });
  },
]);
