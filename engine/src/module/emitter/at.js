const { Action } = require('@coderich/gameflow');

Action.define('at', [
  async ({ target, rest }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    actor.send('text', `--- You @ ${target.name} ---`);
    return target.send('text', `${actor.name} says to you: ${rest.join(' ')}`);
  },
]);
