const { Action } = require('@coderich/gameflow');

Action.define('territorial', [
  (_, { actor, stream }) => {
    const scan = async () => {
      if (!actor.$target) {
        const room = CONFIG.get(await REDIS.get(`${actor}.room`));
        const target = APP.randomElement(Array.from(room.units.values()).filter(unit => unit.type === 'player'));
        if (target) actor.stream('action', 'attack', { target });
      }
    };

    stream.on('abort', () => {
      SYSTEM.offFunction(scan);
    });

    scan();

    actor.on('post:move', ({ result }) => {
      const { room, exit } = result;
      SYSTEM.on(`enter:${exit}`, scan);
      SYSTEM.off(`enter:${room}`, scan);
    });

    SYSTEM.on(`enter:${actor.room}`, scan);
  },
]);
