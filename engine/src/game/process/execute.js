const { Action } = require('@coderich/gameflow');

module.exports = Action.define('execute', async (command, { actor, abort }) => {
  const context = { translate: true };
  const { name, code, input, stream } = command;

  switch (name) {
    case 'north': case 'south': case 'east': case 'west': case 'northeast': case 'northwest': case 'southeast': case 'southwest': case 'up': case 'down': {
      return actor.stream(stream, 'move', code, context);
    }
    case 'unknown': {
      return actor.stream('voice', 'say', input, context);
    }
    case 'none': {
      return actor.stream('info', 'room', null, context);
    }
    default: {
      return actor.stream(stream, name, command, context);
    }
  }
});
