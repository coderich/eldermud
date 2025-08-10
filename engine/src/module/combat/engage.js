const { Action, Loop } = require('@coderich/gameflow');

/**
 * This takes into account the time it takes to move into position for an attack
 */
Action.define('engage', [
  // Listeners/Aborts
  async ({ target }, { actor, stream, abort, promise }) => {
    const $abort = () => abort();

    promise.finally(() => {
      delete actor.$target;
      target.offFunction($abort);
      stream.offFunction($abort);
    });

    stream.once('add', $abort);
    target.once('post:move', $abort);
    target.once('pre:death', $abort);
    if (stream.length()) abort();
  },

  // Engage with the target
  async ({ target }, { actor }) => {
    const info = await actor.mGet('room', 'engageSpeed');
    const room = CONFIG.get(info.room);
    actor.send('text', APP.styleText('engaged', `*combat engaged (${target.name})*`));
    target.send('text', APP.styleText(actor.type, actor.name), 'moves to attack', `${APP.styleText('highlight', 'you')}!`);
    Array.from(room.units.values()).filter(unit => unit !== actor && unit !== target).forEach(unit => unit.send('text', APP.styleText(actor.type, actor.name), 'moves to attack', `${APP.styleText(target.type, target.name)}!`));
    await APP.timeout(info.engageSpeed);
  },

  // Duel
  new Loop([
    // Prepare attack
    (data, { attack }) => {
      attack = typeof data.attack === 'function' ? data.attack() : data.attack;
      return APP.timeout(attack.speed);
    },

    // Perform strike
    async (data, { actor }) => {
      if (actor.$target) await actor.perform('strike', data);
    },
  ]),
]);
