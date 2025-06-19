const Game = require('@coderich/gameflow');
const Actor = require('../../model/Actor');

/**
 * Responsible for normalizing input that comes from the command line before reaching actions
 */
SYSTEM.on('*', async (event, context) => {
  const { actor, data, translate, abort } = context;
  const [type, action] = event.split(':');

  // Normalize input for actions
  if (type === 'pre' && data && translate) {
    const { args, tags = [], input } = data;

    if (tags.includes('talent')) {
      if (!actor.talents.find(t => t.id === action)) {
        abort();
        actor.perform('say', input);
      }
    }

    // Tag based targeting...
    if (tags.includes('unit')) {
      const { units } = CONFIG.get(await actor.get('room'));
      Object.assign(data, APP.target([...units], args));
    } else if (tags.includes('other')) {
      const { units } = CONFIG.get(await actor.get('room'));
      Object.assign(data, APP.target([...units].filter(unit => unit !== actor), args));
    } else if (tags.includes('player')) {
      const { units } = CONFIG.get(await actor.get('room'));
      Object.assign(data, APP.target([...units].filter(unit => unit.type === 'player'), args));
    } else if (tags.includes('npc')) {
      const { units } = CONFIG.get(await actor.get('room'));
      Object.assign(data, APP.target([...units].filter(unit => unit.type === 'npc'), args));
    } else if (tags.includes('corpse')) {
      const { items } = CONFIG.get(await REDIS.get('room'));
      Object.assign(data, APP.target([...items].filter(item => item.id === 'corpse'), args));
    } else if (tags.includes('realm')) {
      Object.assign(data, APP.target(Object.values(Game.Actor), args));
    }

    // Specific action handling...
    switch (action) {
      case 'get': {
        const room = CONFIG.get(await actor.get('room'));
        const roomItems = Array.from(room.items.values()).filter(item => item instanceof Actor);
        const searchItems = Array.from(actor.$search.values());
        Object.assign(data, APP.target(roomItems.concat(searchItems), args));
        break;
      }
      case 'open': case 'close': {
        const room = CONFIG.get(await actor.get('room'));

        // Door check
        const cmd = await actor.perform('translate', args.join(' '));
        if (cmd.tags?.includes('direction')) return Object.assign(data, { target: room.paths?.[cmd.code] });

        // Items check
        const inventory = await REDIS.sMembers(`${actor}.inventory`).then(keys => keys.map(key => CONFIG.get(key.split('.').slice(0, -1).join('.'))));
        const roomItems = Array.from(room.items.values());
        return Object.assign(data, APP.target(inventory.concat(roomItems), args));
      }
      case 'drop': case 'use': {
        const inventory = await APP.hydrate(await REDIS.sMembers(`${actor}.inventory`));
        Object.assign(data, APP.target(inventory, args));
        break;
      }
      case 'list': case 'buy': case 'sell': {
        const { shop } = CONFIG.get(await actor.get('room'));
        Object.assign(data, { shop });
        break;
      }
      case 'look': case 'search': {
        let target;
        const room = CONFIG.get(await actor.get('room'));

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
        const $config = CONFIG.toObject();
        const things = Object.values($config.data).map(el => Object.values(el)).flat().filter(Boolean);
        Object.assign(data, APP.target(things, args));
        break;
      }
      default: {
        break;
      }
    }
  }

  return null;
});
