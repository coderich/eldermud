const { Action } = require('@coderich/gameflow');

/**
 * This takes into account the time it takes to move into position for an attack
 */
Action.define('engage', [
  async ({ target, attack }, { actor, abort }) => {
    if (!target) abort('You dont see that here!');
    actor.$target = target;
  },

  // Engage with the target
  ({ target, attack }, { actor, stream, abort, promise }) => {
    const disengage = ({ result }) => {
      delete actor.$target;
      delete actor.$engaged;
      abort();
    };

    stream.once('add', disengage);
    actor.once('post:move', disengage);
    actor.once('post:break', disengage);
    target.once('post:move', disengage);
    target.once('post:death', disengage); // They may die before we get to duel
    actor.send('text', APP.styleText('engaged', `*combat engaged (${target.name})*`));
    target.send('text', APP.styleText(actor.type, actor.name), 'moves to attack', `${APP.styleText('highlight', 'you')}!`);
    Array.from(CONFIG.get(`${actor.room}`).units.values()).filter(unit => unit !== actor && unit !== target).forEach(unit => unit.send('text', APP.styleText(actor.type, actor.name), 'moves to attack', `${APP.styleText(target.type, target.name)}!`));

    APP.timeout(2000).then(() => {
      if (!promise.aborted) {
        actor.$engaged = true;
        target.$killers.add(actor);
        stream.off('add', disengage);
        actor.stream(stream, 'duel', { target, attack });
      }
    });
  },
]);
