/**
 * Responsible for creating new/specialized/specific game events
 */

const Unit = require('../../model/Unit');

SYSTEM.on('*', async (event, context) => {
  const { result, actor } = context;
  const [type, action] = event.split(':');

  // // Combat
  // if (event === 'pre:engage') SYSTEM.emit('pre:combat', context);
  // if (event === 'abort:engage') SYSTEM.emit('abort:combat', context);
  // if (['start:duel', 'post:duel', 'abort:duel'].includes(event)) SYSTEM.emit(`${type}:combat`, context);

  if (type === 'post') {
    if (result?.target) {
      SYSTEM.emit(`${action}:${result.target}`, context);
    }

    switch (action) {
      case 'spawn': { // Enter the realm
        if (actor instanceof Unit) SYSTEM.emit(`enter:${result.room}`, context);
        break;
      }
      case 'exit': { // Exit realm
        SYSTEM.emit(`leave:${result.exit}`, context);
        break;
      }
      case 'teleport': {
        SYSTEM.emit(`enter:${result.room}`, context);
        SYSTEM.emit(`leave:${result.exit}`, context);
        break;
      }
      case 'move': {
        SYSTEM.emit(`path:${result.exit.paths?.[result.dir]}`, context);
        SYSTEM.emit(`enter:${result.room}`, context);
        SYSTEM.emit(`leave:${result.exit}`, context);
        break;
      }
      default: {
        break;
      }
    }
  }
});
