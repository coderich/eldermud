const { Action } = require('@coderich/gameflow');

Action.define('list', [
  ({ shop }, { abort }) => {
    if (!shop) abort('You are not in a shop!');
  },
  ({ shop }, { actor }) => {
    actor.send('text', '\nThe following items are for sale (you may', APP.styleText('keyword', 'look'), 'or', APP.styleText('keyword', 'buy'), 'an item of interest):\n');
    actor.send('text', APP.table([
      ['Item', 'Description', 'Remnant Cost'],
      ...shop.inventory.map(item => [item.name, item.description, item.value]),
    ], { header: true }));
  },
]);
