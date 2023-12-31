const { Action } = require('@coderich/gameflow');

Action.define('greet', [
  async ({ target, rest }, { actor, abort }) => {
    if (rest.length) return abort('You dont see that here!');
    if (!target) return abort('You greet everybody.');
    return actor.socket.emit('text', `You greet ${target.name}.`);
  },
]);
