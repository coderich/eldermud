/**
 * Responsible for normalizing input that comes from the command line before reaching actions
 */
SYSTEM.on('*', async (event, context) => {
  const { actor, data, translate } = context;
  const [type, action] = event.split(':');

  // Normalize input for actions
  if (type === 'pre' && translate) {
    switch (action) {
      case 'greet': case 'ask': case 'attack': {
        const { args } = data;
        const { units } = CONFIG.get(await REDIS.get(`${actor}.room`));
        Object.assign(data, APP.target([...units].filter(u => u !== actor), args));
        break;
      }
      case 'get': {
        const { args } = data;
        const items = Array.from(actor.roomSearch.values());
        console.log(items);
        Object.assign(data, APP.target(items, args));
        break;
      }
      case 'list': {
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

        // Item (TODO!)
        break;
      }
      default: {
        break;
      }
    }
  }

  return null;
});
