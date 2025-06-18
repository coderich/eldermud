const { Action } = require('@coderich/gameflow');

Action.define('sanctuary', [
  async (_, context) => {
    const room = CONFIG.get(await context.actor.get('room'));

    // Do not allow creatures to enter sanctuary
    const moveHandler = async ({ actor, data, abort }) => {
      if (actor.type === 'creature') {
        const actorRoom = CONFIG.get(await actor.get('room'));
        const toRoom = actorRoom.exits[data];
        if (`${toRoom}` === `${room}`) abort();
      }
    };

    // Do not allow fighting in the sanctuary
    const attackHandler = async ({ actor, abort }) => {
      const actorRoom = CONFIG.get(await actor.get('room'));
      if (`${actorRoom}` === `${room}`) abort('You break off your attack.');
    };

    SYSTEM.on('pre:move', moveHandler);
    SYSTEM.on('pre:attack', attackHandler);
    context.actor.on('post:destroy', () => {
      SYSTEM.off('pre:move', moveHandler);
      SYSTEM.off('pre:attack', attackHandler);
    });
  },
]);
