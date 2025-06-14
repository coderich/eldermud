const { Action } = require('@coderich/gameflow');

Action.define('sanctuary', [
  (_, context) => {
    // Do not allow creatures to enter sanctuary
    const moveHandler = ({ actor, data, abort }) => {
      const toRoom = CONFIG.get(`${actor.room}.exits.${data}`);
      if (`${toRoom}` === `${context.actor.room}` && actor.type === 'creature') abort();
    };

    // Do not allow fighting in the sanctuary
    const attackHandler = ({ actor, abort }) => {
      if (`${actor.room}` === `${context.actor.room}`) abort('You break off your attack.');
    };

    SYSTEM.on('start:move', moveHandler);
    SYSTEM.on('start:engage', attackHandler);
    context.actor.on('post:destroy', () => {
      SYSTEM.off('start:move', moveHandler);
      SYSTEM.off('start:engage', attackHandler);
    });
  },
]);
