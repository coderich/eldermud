const { Action } = require('@coderich/gameflow');

Action.define('engage', [
  async ({ target, attack }, { actor, stream, abort }) => {
    if (!target) abort('You dont see that here!');
    const disengage = () => abort();
    target.$killers ??= new Set();
    actor.$target = target;
    stream.once('add', disengage);
    actor.once('post:duel', disengage);
    target.once('post:death', disengage); // They may die before we get to duel
  },

  // Engage with the target
  ({ target, attack, mods }, { actor, stream, promise }) => {
    actor.send('text', APP.styleText('engaged', `*combat engaged (${target.name})*`));

    APP.timeout(2000).then(() => {
      if (!promise.aborted) {
        target.$killers.add(actor);
        actor.stream(stream, 'duel', { target, attack, mods });
      }
    });
  },
]);
