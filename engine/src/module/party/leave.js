const { Action } = require('@coderich/gameflow');

Action.define('leave', [
  async (_, { actor, abort }) => {
    if (!actor.$following) abort('You are not in a party!');
  },
  (_, { actor }) => {
    actor.$party = new Set();
    actor.$partyRank = 1;
    actor.$following.$party.delete(actor);
    actor.$following.off('pre:move', actor.$follow);
    actor.send('text', APP.styleText('engaged', `*You are no longer following ${actor.$following.name}*`));
    actor.$following.send('text', `${actor.name} has left the party.`);
    delete actor.$follow;
    delete actor.$following;
  },
]);