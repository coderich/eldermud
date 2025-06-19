const { Action } = require('@coderich/gameflow');

/**
 * Gain knowledge about this creature type
 */
Action.define('study', [
  async ({ target, rest }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    return actor.send('text', `You ask ${target.name} your questions`);
  },
]);
