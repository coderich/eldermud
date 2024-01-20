const { Action } = require('@coderich/gameflow');

Action.define('frontrank', [
  async (_, { actor, abort }) => {
    if (!actor.$party.size) return abort('You are not in a party!');
    actor.$partyRank = 1;
    actor.send('text', 'You position yourself frontrank.');
    return actor.$party.forEach(unit => unit.send('text', `${actor.name} just moved frontrank.`));
  },
]);
