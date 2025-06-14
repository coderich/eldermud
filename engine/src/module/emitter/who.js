const { Actor, Action } = require('@coderich/gameflow');

Action.define('who', [
  async (_, { actor }) => {
    actor.send('text', APP.styleText('highlight', 'Current Adventurers:'));
    actor.send('text', APP.table([
      ...Object.values(Actor).map(unit => [
        '  ',
        unit.name,
        `(${CONFIG.get(unit.class).name})`,
      ]),
    ], { sep: '' }));
  },
]);
