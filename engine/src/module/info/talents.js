const { Action } = require('@coderich/gameflow');

Action.define('talents', [
  async (_, { actor }) => {
    const talents = await actor.get('talents').then(s => Array.from(s.values()).map(t => CONFIG.get(`${t}`)));
    actor.send('text', APP.table([
      ['Code', 'Name', 'Target', 'Cost'],
      ...talents.map(t => [APP.styleText('keyword', t.code), t.name, t.target, t.cost]),
    ], { header: true }));
  },
]);
