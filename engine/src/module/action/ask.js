const { Action } = require('@coderich/gameflow');

Action.define('ask', [
  ({ target }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    return actor.send('text', `You ask ${target.name} your questions`);
  },
]);
