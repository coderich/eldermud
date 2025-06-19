const { Action, Actor } = require('@coderich/gameflow');

Action.define('open', [
  ({ target }, { abort, actor }) => {
    if (!target) abort('There is nothing to open!');
    else if (target.status === 'open') abort(`The ${target.name} is already open!`);
    else if (target.status === 'locked') abort(`The ${target.name} is locked!`);
  },
  async ({ target }, { actor, abort }) => {
    switch (target.type) {
      case 'door': {
        CONFIG.set(`${target}.status`, 'open');
        actor.perform('map');
        return actor.send('text', `You open the ${target.name}`);
      }
      case 'chest': {
        if (target instanceof Actor) {
          return null;
        }

        // World Map Chest
        if (await REDIS.sAdd(`${target}.players`, `${actor}`)) {
          const items = await APP.instantiate(target.spawns.map(spawn => Array.from(new Array(APP.roll(spawn.num))).map(() => APP.randomElement(spawn.items))).flat(2), {
            owner: `${actor}`,
            // container: `${target}`, // This needed? (see "get" action)
          });
          await REDIS.sAdd(`${target}.inventory`, items.map(item => `${item}`));
        }

        const inventory = await APP.hydrate(await REDIS.sMembers(`${target}.inventory`)).then(items => items.filter(item => item.owner === `${actor}`));
        const contents = inventory.length ? inventory.map(item => APP.styleText('keyword', item.name)).join(', ') : 'nothing.';
        actor.$search = new Set(inventory);
        return actor.send('text', `You open the ${target.name} and reveal: ${contents}`);
      }
      default: {
        return abort('You cannot open that!');
      }
    }
  },
]);
