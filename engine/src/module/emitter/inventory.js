const { Action } = require('@coderich/gameflow');

Action.define('inventory', [
  async (_, { actor }) => {
    const items = await APP.hydrate(await REDIS.sMembers(`${actor}.inventory`));

    const inventory = items.reduce((prev, item) => {
      prev[item.id] ??= { name: item.name, num: 0 };
      prev[item.id].num++;
      return prev;
    }, {});

    const description = items.length ? Object.values(inventory).map(item => APP.styleText('keyword', item.name).concat(`(${item.num})`)).join(', ') : 'nothing!';
    actor.send('text', 'You are carrying:', description);
    actor.send('text', APP.styleText('stat', 'Encumbrance:'), APP.styleText('value', actor.enc));
  },
]);
