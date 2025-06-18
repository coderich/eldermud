const { Action } = require('@coderich/gameflow');

/**
 * Initiate basic weapon attack
 */
Action.define('attack', [
  ({ target }, { abort }) => {
    if (!target) abort('You dont see that here!');
  },

  async ({ target }, { actor, stream }) => {
    const attacks = await actor.get('attacks');
    const attack = () => APP.randomElement(attacks);
    actor.stream(stream, 'engage', { target, attack });
  },
]);
