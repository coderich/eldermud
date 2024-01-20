const { Action } = require('@coderich/gameflow');

Action.define('midrank', [
  async (_, { actor, abort }) => {
    if (!actor.$party.size) return abort('You are not in a party!');
    actor.$partyRank = 2;
    actor.send('text', 'You position yourself midrank.');
    return actor.$party.forEach(unit => unit.send('text', `${actor.name} just moved midrank.`));
  },
]);
