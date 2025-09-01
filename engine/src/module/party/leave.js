const { Action } = require('@coderich/gameflow');

Action.define('leave', [
  async (_, { actor, abort }) => {
    if (!actor.$following) abort('You are not in a party!');
  },
  (_, { actor }) => {
    actor.$following.$party.delete(actor);
    actor.writeln(APP.styleText('engaged', `*You are no longer following ${actor.$following.name}*`));
    actor.$following.$party.forEach(el => el.writeln(`${APP.styleText(actor.type, actor.name)} has left your party`));
    actor.$party = new Set([actor]);
    actor.$partyRank = 1;
    delete actor.$following;
  },
]);
