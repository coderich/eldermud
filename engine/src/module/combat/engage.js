const { Action, Loop } = require('@coderich/gameflow');

/**
 * This takes into account the time it takes to move into position for an attack
 */
Action.define('engage', [
  // Listeners/Aborts
  async ({ target }, { actor, stream, abort, promise }) => {
    const $abort = (event) => {
      abort();
      if (event.reason === null) {
        delete actor.$retarget;
        delete actor.$engageTarget;
        actor.$attackers.delete(target);
      }
    };

    promise.finally(() => {
      delete actor.$target;
      target.offFunction($abort);
      stream.offFunction($abort);
      actor.send('text', APP.styleText('engaged', '*combat off*'));
    });

    stream.once('add', $abort);
    target.once('post:move', $abort);
    target.once('pre:death', $abort);
    if (stream.length()) abort();
  },

  // Engage with the target
  async ({ target }, { actor }) => {
    // No penalty for re-engaging the same target
    const info = await actor.mGet('room', 'engageSpeed');
    const room = CONFIG.get(info.room);
    actor.send('text', APP.styleText('engaged', `*combat engaged (${target.name})*`));
    target.send('text', APP.styleText(actor.type, actor.name), 'moves to attack', `${APP.styleText('highlight', 'you')}!`);
    Array.from(room.units.values()).filter(unit => unit !== actor && unit !== target).forEach(unit => unit.send('text', APP.styleText(actor.type, actor.name), 'moves to attack', `${APP.styleText(target.type, target.name)}!`));

    if (target !== actor.$engageTarget) {
      actor.$engageTarget = target;
      await APP.timeout(info.engageSpeed);
    }
  },

  // Striking Duel
  new Loop([
    // Prepare attack
    (data, { attack }) => {
      data.strike = typeof data.attack === 'function' ? data.attack() : data.attack;
      return APP.timeout(data.strike.speed);
    },

    // Perform strike
    async (data, { actor }) => {
      if (actor.$target) await actor.perform('strike', data);
    },
  ]),
]);
