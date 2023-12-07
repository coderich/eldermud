const { Action } = require('@coderich/gameflow');

Action.define('process', (command, { actor }) => {
  switch (command.scope) {
    case 'navigation': return actor.perform('move', command.code);
    default: return null;
  }
});
