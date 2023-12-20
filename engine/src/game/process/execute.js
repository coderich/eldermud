const { Action } = require('@coderich/gameflow');

module.exports = Action.define('execute', (command, { actor }) => {
  const { scope } = command;

  switch (scope) {
    case 'navigation': {
      return actor.stream(actor.streams.action, 'move', command);
    }
    case 'action': {
      return actor.stream(actor.streams.action, command.name, command);
    }
    case 'default': {
      return actor.stream(actor.streams.action, 'room', command);
    }
    case 'unknown': {
      return actor.stream(actor.streams.action, 'say', command);
    }
    default: {
      return null;
    }
  }
});
