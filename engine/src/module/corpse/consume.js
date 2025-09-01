const { Action } = require('@coderich/gameflow');

/**
 * Depending on the creature, consuming the corpse may grant temporary buffs or debuffs
 */
Action.define('consume', [
  async ({ target }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    return actor.writeln(`You ask ${target.name} your questions`);
  },
]);
