const { Action } = require('@coderich/gameflow');

Action.define('list', [
  ({ shop }, { abort }) => {
    if (!shop) abort('You are not in a shop!');
  },
  async ({ shop }, { actor }) => {
    await actor.send('text', APP.styleText('highlight', '\nWelcome!'), 'Please', APP.styleText('keyword', 'look'), 'or', APP.styleText('keyword', 'buy'), 'any item of interest:\n');
    await actor.send('text', APP.table([
      ['NAME', 'COST'],
      ...shop.inventory.map(item => [item.name, APP.styleText('exp', CONFIG.get('app.char.exp'), item.value)]),
    ], { header: true }), '\n');
  },
]);
