const { Action } = require('@coderich/gameflow');

Action.define('buy', [
  ({ shop, args }, { abort }) => {
    if (!shop) return abort('You are not in a shop!');
    const { items } = shop;
    const { target } = APP.target(items, args);
    if (!target) return abort('You cannot buy that item here!');
    return target;
  },
  async (item, { actor, abort }) => {
    const remnants = await actor.get('exp');
    if (remnants < item.value) return abort('You cannot afford it.');
    const $item = await APP.instantiate(item);
    await REDIS.sAdd(`${actor}.inventory`, `${$item}`);
    await actor.perform('affect', { exp: -item.value });
    return actor.send('text', 'You obtain', item.name);
  },
]);
