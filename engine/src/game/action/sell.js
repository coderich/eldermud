const { Action } = require('@coderich/gameflow');

Action.define('sell', [
  async ({ shop, args }, { actor, abort }) => {
    if (!shop) return abort('You are not in a shop!');
    const { items } = shop;
    const inventory = APP.hydrate(await REDIS.sMembers(`${actor}.inventory`));
    const { target } = APP.target(inventory, args);
    if (!target) return abort('You do not have that to sell!');
    if (!items.find(item => item.id === target.id)) return abort('You cannot sell that here!');
    return target;
  },
  async (item, { actor, abort }) => {
    // item.destroy();
    console.log(`${item}`);
    await REDIS.sRem(`${actor}.inventory`, `${item}`);
    await actor.perform('affect', { exp: item.value });
    return actor.send('text', 'You sell', item.name);
  },
]);
