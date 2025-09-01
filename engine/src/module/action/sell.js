const { Action } = require('@coderich/gameflow');

Action.define('sell', [
  async ({ target: shop, args }, { actor, abort }) => {
    const inventory = await APP.hydrate(await REDIS.sMembers(`${actor}.inventory`));
    const { target } = APP.target(inventory, args);
    if (!target) return abort('You do not have that to sell!');
    if (!shop.inventory.find(item => item.id === target.id)) return abort('You cannot sell that here!');
    return target;
  },
  async (item, { actor, abort }) => {
    await REDIS.sRem(`${actor}.inventory`, `${item}`);
    await actor.perform('affect', { exp: item.value });
    return actor.writeln('You sell', item.name);
  },
]);
