const { Action, Actor } = require('@coderich/gameflow');

Action.define('open', [
  ({ target }, { abort, actor }) => {
    if (!target) abort('There is nothing to open!');
  },
  async ({ target }, { actor, abort }) => {
    if (target.status === 'open') return abort(`The ${target.name} is already open!`);
    if (target.status === 'locked') return abort(`The ${target.name} is locked!`);

    switch (target.type) {
      case 'door': {
        CONFIG.set(`${target}.status`, 'open');
        actor.perform('map');
        return actor.send('text', `You open the ${target.name}.`);
      }
      case 'chest': {
        if (target instanceof Actor) {
          return null;
        }
        // World Map Chest
        if (await REDIS.sAdd(`${target}.players`, `${actor}`)) {
          const items = await APP.instantiate(target.spawns.map(spawn => Array.from(new Array(APP.roll(spawn.num))).map(() => APP.randomElement(spawn.items))).flat(2), { owner: `${actor}` });
          await REDIS.sAdd(`${target}.inventory`, ...items.map(item => `${item}`));
        }

        const inventory = await APP.hydrate(await REDIS.sMembers(`${target}.inventory`)).then(items => items.filter(item => item.owner === `${actor}`));
        const contents = inventory.length ? inventory.map(item => APP.styleText('keyword', item.name)).join(', ') : 'nothing.';
        return actor.send('text', `You open the ${target.name} and reveal: ${contents}`);
      }
      default: {
        return abort('You cannot open that!');
      }
    }
  },
]);
