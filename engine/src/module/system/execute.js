const { Action } = require('@coderich/gameflow');

/**
 * Delegates the command to the appropriate stream/action
 */
module.exports = Action.define('execute', async (command, { actor, abort, promise }) => {
  const context = { translate: true };
  const { name, input, stream } = command;

  // Echo back actions...
  // if (stream === 'action') actor.stream(stream, new Action(null, () => actor.send('text', input)));

  switch (name) {
    case 'unknown': {
      return actor.stream('voice', 'say', input, context);
    }
    case 'none': {
      return actor.stream('info', 'room', null, context);
    }
    case 'break': {
      return actor.perform('break');
    }
    default: {
      return actor.stream(stream, name, command, context);
    }
  }
});
