const { Action } = require('@coderich/gameflow');

/**
 * Show respect by burying the corpse, potentially gaining favor with certain factions or NPCs
 */
Action.define('bury', [
  async ({ target, rest }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    return actor.send('text', `You ask ${target.name} your questions.`);
  },
]);
