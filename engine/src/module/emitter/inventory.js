const { Action } = require('@coderich/gameflow');

Action.define('inventory', [
  async (_, { actor }) => {
    const items = await REDIS.sMembers(`${actor}.inventory`).then((ids) => {
      return ids.map(id => CONFIG.get(id.split('.').slice(0, -1).join('.'))).filter(Boolean);
    });

    const description = items.length ? items.map(item => item.name).join(', ') : 'nothing!';
    actor.send('text', 'You are carrying', description);
  },
]);
