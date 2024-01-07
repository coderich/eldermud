const { Action } = require('@coderich/gameflow');

Action.define('list', [
  async ({ shop }, { actor, abort }) => {
    if (!shop) return abort('You are not in a shop!');

    return actor.send('text', APP.table([
      ['item', 'description', 'cost'],
      ...shop.items.map(item => [item.name, item.description, item.value]),
    ], { header: true }));
  },
]);
