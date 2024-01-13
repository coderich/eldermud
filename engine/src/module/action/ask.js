const { Action } = require('@coderich/gameflow');

Action.define('ask', [
  async ({ target, rest }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    return actor.send('text', `You ask ${target.name} your questions.`);
  },
]);
