const { Action } = require('@coderich/gameflow');

Action.define('inventory', [
  async (_, { actor }) => {
    const items = await REDIS.sMembers(`${actor}.inventory`).then((ids) => {
      return ids.map(id => CONFIG.get(id.split('.').slice(0, -1).join('.'))).filter(Boolean);
    });

    actor.socket.emit('table', {
      name: 'inventory',
      columns: [{ name: 'NAME', width: 20 }, { name: 'QTY', width: 10 }],
      rows: items.map(item => [item.name, '1']),
    });
  },
]);
