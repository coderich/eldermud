const { Action } = require('@coderich/gameflow');

module.exports = Action.define('execute', (command, { actor }) => {
  const { scope } = command;

  switch (scope) {
    case 'navigation': {
      return actor.stream(actor.streams[scope], 'move', command);
    }
    case 'action': {
      switch (command.code) {
        case 'ask': return actor.stream(actor.streams[scope], 'ask', command);
        case 'help': return actor.stream(actor.streams[scope], 'help', command);
        case 'greet': return actor.stream(actor.streams[scope], 'greet', command);
        default: return null;
      }
    }
    case 'default': {
      return actor.stream(actor.streams[scope], 'room', command);
    }
    default: {
      return actor.socket.emit('text', `You say "${command.input}"`);
    }
  }
});
