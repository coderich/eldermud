const { Action } = require('@coderich/gameflow');

/**
 * Initiate basic attack with whatever weapon is in hand
 */
Action.define('attack', [
  ({ target }, { abort }) => {
    if (!target) abort('You dont see that here!');
  },

  ({ target }, { actor, stream }) => {
    const attack = APP.randomElement(actor.attacks);
    const mods = { acc: actor.acc, ac: target.ac, dr: target.dr };
    actor.stream(stream, 'engage', { target, attack, mods });
  },
]);
