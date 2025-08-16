const Actor = require('../../model/Actor');

/**
 * Responsible for normalizing input that comes from the command line before reaching actions
 */
SYSTEM.prependListener('*', async (event, context) => {
  const { actor, data, translate, abort } = context;
  const [type, action] = event.split(':');

  // Normalize input for actions
  if (type === 'pre' && data && translate) {
    const { args, code, tags = [], input } = data;
    const room = actor.room = CONFIG.get(await actor.get('room')); // Consider adding this to "data" for downstream

    if (tags.includes('talent')) {
      const talent = actor.talents.values().find(t => t.code === code);
      if (!talent) { abort(); return actor.perform('say', input); }
      Object.assign(data, { talent: CONFIG.get(`${talent}`) });
    }

    // Target handling...
    if (data.target) await actor.perform('target', data, { $abort: abort });

    // Specific action handling...
    switch (action) {
      case 'get': {
        const roomItems = Array.from(room.items.values()).filter(item => item instanceof Actor);
        const searchItems = Array.from(actor.$search.values());
        Object.assign(data, APP.target(roomItems.concat(searchItems), args));
        break;
      }
      case 'open': case 'close': {
        // Door check
        const cmd = await actor.perform('translate', args.join(' '));
        if (cmd.tags?.includes('direction')) return Object.assign(data, { target: room.paths?.[cmd.code] });

        // Items check
        const inventory = await REDIS.sMembers(`${actor}.inventory`).then(keys => keys.map(key => CONFIG.get(key.split('.').slice(0, -1).join('.'))));
        const roomItems = Array.from(room.items.values());
        return Object.assign(data, APP.target(inventory.concat(roomItems), args));
      }
      case 'look': case 'search': {
        let target;

        // Current room
        if (!args.length) return Object.assign(data, { target: room });

        // Direction
        const cmd = await actor.perform('translate', args.join(' '));
        if (cmd.tags?.includes('direction')) {
          const path = room.paths?.[cmd.code];
          if (path?.opaque) return Object.assign(data, { target: path, cmd });
          return Object.assign(data, { target: room.exits?.[cmd.code], cmd });
        }

        // Pathway obstacles
        ({ target } = APP.target(Object.values(room.paths || {}), args));
        if (target) return Object.assign(data, { target });

        // Unit
        ({ target } = APP.target(room.units, args));
        if (target) return Object.assign(data, { target });

        // Item
        const inventory = await REDIS.sMembers(`${actor}.inventory`).then(keys => keys.map(key => CONFIG.get(key.split('.').slice(0, -1).join('.'))));
        const roomItems = Array.from(room.items.values());
        return Object.assign(data, APP.target(inventory.concat(roomItems), args));
      }
      case 'help': {
        if (!args.length) {
          Object.assign(data, { target: { type: 'help' } });
        } else {
          Object.assign(data, APP.targetHelp(args));
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  return null;
});
