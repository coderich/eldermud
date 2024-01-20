const { Action } = require('@coderich/gameflow');

Action.define('backrank', [
  async (_, { actor, abort }) => {
    if (!actor.$party.size) return abort('You are not in a party!');
    actor.$partyRank = 3;
    actor.send('text', 'You position yourself backrank.');
    return actor.$party.forEach(unit => unit.send('text', `${actor.name} just moved backrank.`));
  },
]);
