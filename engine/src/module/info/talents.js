const { Action } = require('@coderich/gameflow');

Action.define('talents', [
  async (_, { actor }) => {
    const talents = await actor.get('talents').then(s => Array.from(s.values()).map(t => CONFIG.get(`${t}`)));
    await actor.send('text', APP.table([
      ['Code', 'Name', 'Target', 'Duration', 'Cooldown', 'Cost'],
      ...talents.map(t => [APP.styleText('keyword', t.code), t.name, t.target, t.duration || '-', t.cooldown, t.cost]),
    ], { header: true }));
  },
]);
