/**
 * Responsible for creating new/specialized/specific game events
 */
SYSTEM.on('*', async (event, context) => {
  const { result } = context;
  const [type, action] = event.split(':');

  if (type === 'post') {
    switch (action) {
      case 'spawn': { // Enter the realm
        SYSTEM.emit(`enter:${result.room}`, context);
        break;
      }
      case 'exit': {
        SYSTEM.emit(`leave:${result.room}`, context);
        break;
      }
      case 'move': {
        SYSTEM.emit(`path:${result.room.paths?.[result.dir]}`, context);
        SYSTEM.emit(`enter:${result.exit}`, context);
        SYSTEM.emit(`leave:${result.room}`, context);
        break;
      }
      case 'ask': {
        context.args = result.args;
        SYSTEM.emit(`ask:${result.target}`, context);
        break;
      }
      case 'search': case 'greet': case 'look': {
        SYSTEM.emit(`${action}:${result.target}`, context);
        break;
      }
      default: break;
    }
  }
});
