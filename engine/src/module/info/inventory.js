const { Action } = require('@coderich/gameflow');

Action.define('inventory', [
  async (_, { actor }) => {
    const items = await APP.hydrate(await REDIS.sMembers(`${actor}.inventory`));
    const info = await actor.mGet('enc', 'carry', 'weapon', 'armor');
    const weapon = CONFIG.get(`${info.weapon}`);
    const armor = CONFIG.get(`${info.armor}`);

    const inventory = items.reduce((prev, item) => {
      prev[item.id] ??= { name: item.name, num: 0 };
      prev[item.id].num++;
      return prev;
    }, {});

    const description = items.length ? Object.values(inventory).map(item => APP.styleText('keyword', item.name).concat(`(${item.num})`)).join(', ') : 'nothing!';
    await actor.writeln(APP.styleText('stat', 'Gear:'), APP.styleText('keyword', weapon.name, '+', armor.name));
    await actor.writeln(APP.styleText('stat', 'Inventory:'), description);
    await actor.writeln(APP.styleText('stat', 'Encumbrance:'), APP.styleText('value', `${info.enc}/${info.carry}`));
  },
]);
