/**
 * Responsible for normalizing input that comes from the command line before reaching actions
 */
SYSTEM.on('*', async (event, context) => {
  const { actor, data, translate } = context;
  const [type, action] = event.split(':');

  // Normalize input for actions
  if (type === 'pre' && translate) {
    switch (action) {
      case 'greet': case 'ask': case 'attack': case 'follow': case 'invite': {
        const { args } = data;
        const { units } = CONFIG.get(await REDIS.get(`${actor}.room`));
        Object.assign(data, APP.target([...units].filter(unit => unit !== actor), args));
        break;
      }
      case 'get': {
        const { args } = data;
        const items = Array.from(actor.$search.values());
        Object.assign(data, APP.target(items, args));
        break;
      }
      case 'list': case 'buy': case 'sell': {
        const { shop } = CONFIG.get(await REDIS.get(`${actor}.room`));
        Object.assign(data, { shop });
        break;
      }
      case 'look': case 'search': {
        const { args } = data;
        const room = CONFIG.get(await REDIS.get(`${actor}.room`));

        // Current room
        if (!args.length) return Object.assign(data, { target: room });

        // Direction
        const cmd = await actor.perform('translate', args.join(' '));
        if (cmd.tags?.includes('direction')) return Object.assign(data, { target: room.exits?.[cmd.code] });

        // Unit
        const { target } = APP.target(room.units, args);
        if (target) return Object.assign(data, { target });

        // Item
        const inventory = await REDIS.sMembers(`${actor}.inventory`).then(keys => keys.map(key => CONFIG.get(key.split('.').slice(0, -1).join('.'))));
        const roomItems = Array.from(room.items.values());
        return Object.assign(data, APP.target(inventory.concat(roomItems), args));
      }
      case 'help': {
        const { args } = data;
        const config = CONFIG.get();
        const things = Object.values(config).map(el => Object.values(el));
        Object.assign(data, APP.target(things.flat(), args));
        break;
      }
      default: {
        break;
      }
    }
  }

  return null;
});
