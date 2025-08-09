const { Action } = require('@coderich/gameflow');

Action.define('invite', [
  ({ target }, { actor, abort }) => {
    if (!target) abort('You dont see that here!');
    if (actor.$following) abort('You are already in a party!');
  },
  ({ target }, { actor }) => {
    actor.$invited.add(target);
    actor.send('text', APP.styleText('boost', `You invite ${target.name} to follow`));
    target.send('text', APP.styleText('boost', `${actor.name} invites you follow`));
  },
]);
