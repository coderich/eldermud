const { Action } = require('@coderich/gameflow');

Action.define('invite', [
  ({ target }, { actor, abort }) => {
    if (!target) abort('You dont see that here!');
  },
  ({ target }, { actor }) => {
    actor.$invited.add(target);
    actor.send('text', APP.styleText('gesture', `You invite ${target.name} to follow you.`));
    target.send('text', APP.styleText('gesture', `${actor.name} invites you follow them.`));
  },
]);
