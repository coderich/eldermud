const { Action } = require('@coderich/gameflow');

Action.define('talents', [
  async (_, { actor }) => {
    const talents = await actor.get('talents').then(s => Array.from(s.values()).map(t => CONFIG.get(`${t}`)));
    actor.send('text', APP.table([
      ['Name', 'Code', 'Cost'],
      ...talents.map(t => [t.name, APP.styleText('keyword', t.code), t.cost]),
    ], { header: true }));
  },
]);
