const { Action } = require('@coderich/gameflow');

Action.define('follow', [
  async ({ target }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    actor.send('text', `You are now following ${target.name}`);
    return target.on('pre:move', ({ promise, data }) => {
      actor.follow(promise, data);
    });
  },
]);
