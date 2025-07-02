const { Action } = require('@coderich/gameflow');

Action.define('cmd', async (cmd, { actor }) => {
  return actor.perform('translate', cmd).then((command) => {
    return actor.stream(command.channel, 'execute', command);
  });
});
