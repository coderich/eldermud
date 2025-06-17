const { Action } = require('@coderich/gameflow');

Action.define('sanctuary', [
  async (_, context) => {
    const room = CONFIG.get(await context.actor.get('room'));

    // Do not allow creatures to enter sanctuary
    const moveHandler = async ({ actor, data, abort }) => {
      const actorRoom = CONFIG.get(await actor.get('room'));
      const toRoom = actorRoom.exits[data];
      if (`${toRoom}` === `${room}` && actor.type === 'creature') abort();
    };

    // Do not allow fighting in the sanctuary
    const attackHandler = async ({ actor, abort }) => {
      const actorRoom = CONFIG.get(await actor.get('room'));
      if (`${actorRoom}` === `${room}`) abort('You break off your attack.');
    };

    SYSTEM.on('start:move', moveHandler);
    SYSTEM.on('start:engage', attackHandler);
    context.actor.on('post:destroy', () => {
      SYSTEM.off('start:move', moveHandler);
      SYSTEM.off('start:engage', attackHandler);
    });
  },
]);
