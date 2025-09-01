const { Action } = require('@coderich/gameflow');

const ranks = ['frontrank', 'midrank', 'backrank'];

const changeRank = (rank, { actor, abort }) => {
  if (actor.$party.size <= 1) return abort('You are not in a party!');
  actor.$partyRank = rank;
  const position = ranks[rank - 1];
  actor.writeln(`You position yourself ${position}`);
  return actor.$party.forEach(unit => unit !== actor && unit.writeln(`${APP.styleText(actor.type, actor.name)} has just moved ${position}`));
};

Action.define('frontrank', (_, context) => changeRank(1, context));
Action.define('midrank', (_, context) => changeRank(2, context));
Action.define('backrank', (_, context) => changeRank(3, context));
