const { Action } = require('@coderich/gameflow');

Action.define('list', [
  async ({ target }, { actor }) => {
    await actor.writeln(APP.styleText('highlight', '\nWelcome!'), 'Please', APP.styleText('keyword', 'look'), 'or', APP.styleText('keyword', 'buy'), 'any item of interest:\n');
    await actor.writeln(APP.table([
      ['NAME', 'COST'],
      ...target.inventory.map(item => [item.name, APP.styleText('exp', CONFIG.get('app.char.exp'), item.value)]),
    ], { header: true }), '\n');
  },
]);
