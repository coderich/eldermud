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
    const { args, code, tags = [], input } = data;
    const room = CONFIG.get(await actor.get('room')); // Consider adding this to "data" for downstream

    if (tags.includes('talent')) {
      const talent = actor.talents.values().find(t => t.code === code);
      if (!talent) { abort(); return actor.perform('say', input); }
      Object.assign(data, { talent: CONFIG.get(`${talent}`) });
    }

    // Tag based targeting...
    if (data.target) {
      switch (data.target) {
        case 'unit': Object.assign(data, APP.target([...room.units], args)); break;
        case 'other': Object.assign(data, APP.target([...room.units].filter(unit => unit !== actor), args)); break;
        case 'player': case 'npc': case 'creature': Object.assign(data, APP.target([...room.units].filter(unit => unit.type === data.target), args)); break;
        case 'corpse': Object.assign(data, APP.target([...room.items].filter(item => item.id === 'corpse'), args)); break;
        case 'realm': Object.assign(data, APP.target(Object.values(Game.Actor), args)); break;
        case 'party': Object.assign(data, APP.target([...actor.$party.values()].filter(unit => unit !== actor), args)); break;
        case 'target': data.target = actor.$target; break;
        case 'ally': {
          if (!args.length) {
            data.target = actor;
          } else {
            const units = [...room.units.values().filter(unit => unit.type === 'player'), ...actor.$party];
            Object.assign(data, APP.target([...units].filter(unit => unit !== actor), args));
          }
          break;
        }
        default: break;
      }

      if (!data.target) return abort(APP.styleText('error', 'No valid target found!'));
    }

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
      case 'drop': case 'use': {
        const inventory = await APP.hydrate(await REDIS.sMembers(`${actor}.inventory`));
        Object.assign(data, APP.target(inventory, args));
        break;
      }
      case 'list': case 'buy': case 'sell': {
        const { shop } = room;
        Object.assign(data, { shop });
        break;
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
