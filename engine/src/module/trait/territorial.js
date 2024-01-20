const debounce = require('lodash.debounce');
const { Action } = require('@coderich/gameflow');

Action.define('territorial', [
  (_, { actor, stream, promise }) => {
    // We have to debounce the function to take into account race conditions
    // In doing so we introduce a delay so we should also verify that the promise has not be aborted
    const scan = debounce(async () => {
      if (!actor.$target && !promise.aborted) {
        const room = CONFIG.get(await REDIS.get(`${actor}.room`));
        const target = APP.randomElement(Array.from(room.units.values()).filter(unit => unit.type === 'player'));
        if (target) actor.stream('action', 'attack', { target });
      }
    }, 25);

    stream.on('abort', () => {
      SYSTEM.offFunction(scan);
    });

    actor.on('post:move', ({ result }) => {
      const { room, exit } = result;
      SYSTEM.on(`enter:${exit}`, scan);
      SYSTEM.off(`enter:${room}`, scan);
    });

    SYSTEM.on(`enter:${actor.room}`, scan);

    scan();
  },
]);
