const { Action } = require('@coderich/gameflow');

Action.define('invite', [
  ({ target }, { actor, abort }) => {
    if (!target) abort('You dont see that here!');
    if (actor.$following) abort('You are already in a party!');
  },
  ({ target }, { actor }) => {
    actor.$invited.add(target);
    actor.interpolate(APP.styleText('boost', '{actor.name} {invite} {target.name} to follow'), { actor, target }, false);
  },
]);
