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
          // await APP.instantiate(target.items, { room: `${actor.room}`, owner: `${actor}` }).then((items) => {
          //   return Promise.all(items.map(item => item.perform('spawn')));
          // });
        }
        return null;
        // const inventory = APP.hydrate(REDIS.sMembers(`${target}.inventory`)).filter(item => ``);
      }
      default: {
        return abort('You cannot open that!');
      }
    }
  },
]);
