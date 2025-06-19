/**
 * Responsible for creating new/specialized/specific game events
 */
const Unit = require('../../model/Unit');

SYSTEM.on('*', async (event, context) => {
  const { result, actor } = context;

  if (actor) {
    const [type, action] = event.split(':');

    if (type === 'post') {
      if (result?.target) {
        actor.emit(`${action}:${result.target}`, context);
      }

      switch (action) {
        case 'spawn': { // Enter the realm
          if (actor instanceof Unit) actor.emit(`enter:${result.room}`, context);
          break;
        }
        case 'exit': { // Exit realm
          actor.emit(`leave:${result.exit}`, context);
          break;
        }
        case 'teleport': {
          actor.emit(`enter:${result.room}`, context);
          actor.emit(`leave:${result.exit}`, context);
          break;
        }
        case 'move': {
          actor.emit(`path:${result.exit.paths?.[result.dir]}`, context);
          actor.emit(`enter:${result.room}`, context);
          actor.emit(`leave:${result.exit}`, context);
          break;
        }
        default: {
          break;
        }
      }
    }
  }
});
