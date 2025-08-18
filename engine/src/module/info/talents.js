const { Action } = require('@coderich/gameflow');

Action.define('talents', [
  async (_, { actor }) => {
    const talents = await actor.get('talents').then(s => Array.from(s.values()).map(t => CONFIG.get(`${t}`)));

    await actor.send('text', APP.table([
      ['Code', 'Name', 'Target', 'Deplete', 'Cooldown'],
      ...(talents.map(t => [
        APP.styleText('keyword', t.code),
        t.name,
        t.target,
        Object.entries(t.affect).map(el => el.join(' ')).join(','),
        t.cooldown,
      ])),
    ], { header: true }));
  },
]);
