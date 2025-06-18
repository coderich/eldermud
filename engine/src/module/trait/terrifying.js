const { Action } = require('@coderich/gameflow');

Action.define('terrifying', [
  async (_, context) => {
    const room = CONFIG.get(await context.actor.get('room'));

    // These functions must be defined in the context of the actor
    const heartstop = ({ promise }) => promise.abort();
    const heartbeat = ({ actor }) => actor.off('start:lifeforce', heartstop);
    const heartattack = ({ actor }) => actor.on('start:lifeforce', heartstop);

    // The abort-trait handler
    context.stream.on('abort', () => {
      SYSTEM.offFunction(heartbeat);
      SYSTEM.offFunction(heartattack);
      room.units.forEach(target => target.offFunction(heartstop));
    });

    SYSTEM.on(`enter:${room}`, heartattack);
    SYSTEM.on(`leave:${room}`, heartbeat);
    Array.from(room.units.values()).filter(unit => unit !== context.actor).forEach((unit) => {
      unit.on('start:lifeforce', heartstop);
    });

    context.actor.once('post:move', () => {
      SYSTEM.off(`enter:${room}`, heartattack);
      SYSTEM.off(`leave:${room}`, heartbeat);
      room.units.forEach(unit => unit.off('start:lifeforce', heartstop));
      context.actor.stream('trait', 'terrifying');
    });
  },
]);
