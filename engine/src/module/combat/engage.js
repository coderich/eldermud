const { Action } = require('@coderich/gameflow');

Action.define('engage', [
  async ({ target, attack }, { actor, abort }) => {
    if (!target) abort('You dont see that here!');
    actor.$target = target;
    target.$killers ??= new Set();
  },

  // Engage with the target
  ({ target, attack, mods }, { actor, stream, abort, promise }) => {
    const disengage = () => {
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

    APP.timeout(2000).then(() => {
      if (!promise.aborted) {
        actor.$engaged = true;
        target.$killers.add(actor);
        stream.off('add', disengage);
        actor.stream(stream, 'duel', { target, attack, mods });
      }
    });
  },
]);
