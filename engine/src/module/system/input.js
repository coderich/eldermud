const Game = require('@coderich/gameflow');
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
    const room = CONFIG.get(await actor.get('room')); // Consider adding this to "data" for downstream

    if (tags.includes('talent')) {
      const talent = actor.talents.values().find(t => t.code === code);
      if (!talent) { abort(); return actor.perform('say', input); }
      Object.assign(data, { talent: CONFIG.get(`${talent}`) });
    }

    // Tag based targeting...
    if (data.target) {
      data.rest = args;
      const [target, mods = ''] = data.target.split(':');
      const filter = unit => !mods.includes('>') || unit !== actor;
      const units = Array.from(room.units.values()).filter(filter);
      const party = Array.from(actor.$party.values()).filter(filter);
      const [$target] = [actor.$target, actor.$retarget, ...actor.$attackers.keys()].filter(el => room.units.has(el));

      if (!args.length) {
        if (mods.includes('<')) args.push(actor.name);
        else if ($target && mods.includes('$')) args.push($target.name);
      }

      switch (target) {
        case 'self': data.target = actor; break;
        case 'shop': data.target = room.shop; break;
        case 'room': data.target = units; break;
        case 'target': data.target = $target; break;
        case 'party': data.target = party; break;
        case 'exit': data.target = room?.exits?.[code]; break;
        case 'unit': Object.assign(data, APP.target(units, args)); break;
        case 'partyMember': Object.assign(data, APP.target(party, args)); break;
        // case 'ally': break; // Take into account gang?
        // case '!party': data.target = units.filter(unit => !actor.$party.has(unit)); break;
        case 'realm': Object.assign(data, APP.target(Object.values(Game.Actor), args)); break;
        case 'friendly': Object.assign(data, APP.target([...units.filter(u => u.type === 'player'), ...party], args)); break;
        // case 'hostile': break;
        case 'enemies': data.target = units.filter(unit => unit.type === 'creature').concat(...actor.$attackers.keys()); break;
        case 'corpse': Object.assign(data, APP.target([...room.items].filter(item => item.id === 'corpse'), args)); break;
        default: Object.assign(data, APP.target(units.filter(unit => unit.type === target), args)); break;
      }

      if (!data.target && !mods.includes('?')) {
        return abort(APP.styleText('error', `No valid target (${target}) found!`));
      }
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
