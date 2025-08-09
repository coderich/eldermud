const { Action } = require('@coderich/gameflow');

Action.define('talents', [
  async (_, { actor }) => {
    const talents = await actor.get('talents').then(s => Array.from(s.values()).map(t => CONFIG.get(`${t}`)));
    const rows = talents.map(t => [APP.styleText('keyword', t.code), t.name, t.target, t.cooldown, APP.styleText('status.mma', CONFIG.get('app.char.mana'), t.cost)]);
    await actor.send('text', APP.table([
      ['Code', 'Name', 'Target', 'Cooldown', 'Cost'],
      ...rows,
    ], { header: true }));
  },
]);
