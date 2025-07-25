const { Action } = require('@coderich/gameflow');

/**
 * Initiate an attack on a target in the same room
 */
Action.define('attack', [
  async ({ target }, { actor, abort }) => {
    // We must ensure the target is still in the room (due to movement etc)
    const room = CONFIG.get(await actor.get('room'));
    if (!Array.from(room.units).includes(target)) abort('You dont see that here!');
  },

  async ({ target }, { actor, stream }) => {
    const attacks = await actor.get('attacks');
    const attack = () => APP.randomElement(attacks);
    actor.stream(stream, 'engage', { target, attack });
  },
]);
