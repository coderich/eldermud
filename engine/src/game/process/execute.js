const { Action } = require('@coderich/gameflow');

module.exports = Action.define('execute', (command, { actor }) => {
  const { scope } = command;

  switch (scope) {
    case 'navigation': {
      return actor.stream(actor.streams[scope], 'move', command);
    }
    case 'action': {
      return actor.stream(actor.streams[scope], command.code, command);
    }
    case 'default': {
      return actor.stream(actor.streams[scope], 'room', command);
    }
    default: {
      return actor.socket.emit('text', `You say "${command.input}"`);
    }
  }
});
