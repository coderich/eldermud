const { Action } = require('@coderich/gameflow');

/**
 * Search the corpse for useful items or resources
 */
Action.define('scavenge', [
  async ({ target, rest }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    return actor.send('text', `You ask ${target.name} your questions.`);
  },
]);
