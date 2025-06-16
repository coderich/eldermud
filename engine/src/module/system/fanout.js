/**
 * Responsible for creating new/specialized/specific game events
 */
SYSTEM.on('*', async (event, context) => {
  const { actor, result } = context;
  const [type, action] = event.split(':');

  if (type === 'post') {
    if (result?.target) {
      actor.emit(`${action}:${result.target}`, context);
      SYSTEM.emit(`${action}:${result.target}`, context);
    }

    switch (action) {
      case 'spawn': { // Enter the realm
        SYSTEM.emit(`enter:${result.room}`, context);
        break;
      }
      case 'exit': { // Exit realm
        SYSTEM.emit(`leave:${result.room}`, context);
        break;
      }
      case 'teleport': {
        SYSTEM.emit(`enter:${result.room}`, context);
        SYSTEM.emit(`leave:${result.exit}`, context);
        break;
      }
      case 'move': {
        SYSTEM.emit(`path:${result.room.paths?.[result.dir]}`, context);
        SYSTEM.emit(`enter:${result.exit}`, context);
        SYSTEM.emit(`leave:${result.room}`, context);
        break;
      }
      default: {
        break;
      }
    }
  }
});
