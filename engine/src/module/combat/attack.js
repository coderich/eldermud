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

  async ({ target, strike }, { actor, stream }) => {
    const abort = () => {
      delete actor.$target;
      delete actor.$retarget;
      actor.$attackers.delete(target);
    };

    actor.$target = actor.$retarget = target;
    clearTimeout(target.$attackers.get(actor));
    target.$attackers.set(actor, setTimeout(() => target.$attackers.delete(actor), 60 * 1000 * 2));
    target.once('pre:death', abort);

    if (strike) {
      await APP.timeout(strike.speed);
      await actor.perform('strike', { target, strike }).finally(() => {
        setTimeout(() => target.offFunction(abort), 500);
      });
    } else {
      const attacks = await actor.get('attacks');
      const attack = () => APP.randomElement(attacks);
      actor.stream(stream, 'engage', { target, attack });
    }
  },
]);
