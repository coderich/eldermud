const { Actor, Action } = require('@coderich/gameflow');

Action.define('target', [
  async (data, { actor, $abort }) => {
    const { args = [], code } = data;
    const room = CONFIG.get(`${actor.room}`);

    // Targeting should use bitwise ops instead of .includes
    data.rest = args;
    const [target, mods = ''] = data.target.split(':');
    const isOther = mods.includes('>');
    const isAggressive = mods.includes('$');
    // const isTargeted = mods.includes('@');
    const filter = unit => !isOther || unit !== actor;
    const units = Array.from(room.units.values()).filter(filter);
    const party = Array.from(actor.$party.values()).filter(filter);
    const [$opponent] = [actor.$target, actor.$retarget, ...actor.$attackers.keys()].filter(el => room.units.has(el));

    if (!args.length) {
      if ($opponent && isAggressive) args.push($opponent.name);
      else if (!isOther) args.push(actor.name);
    }

    switch (target) {
      case 'self': data.target = actor; break;
      case 'room': data.target = units; break;
      case 'party': data.target = party; break;
      case 'shop': data.target = room.shop; break;
      case 'opponent': data.target = $opponent; break;
      case 'target': data.target = actor.$$target; break;
      case 'exit': data.target = room?.exits?.[code]; break;

      // This could be 'room:@'
      case 'unit': Object.assign(data, APP.target(units, args)); break;

      // This could be 'realm:@'
      case 'realm': Object.assign(data, APP.target(Object.values(Actor), args)); break;

      // This could be 'party:@'
      case 'comrade': Object.assign(data, APP.target(party, args)); break;

      // This could be better qualified
      case 'friendly': Object.assign(data, APP.target([...units.filter(u => u.type === 'player'), ...party], args)); break;

      case 'enemies': data.target = units.filter(unit => unit.type === 'creature').concat(...actor.$attackers.keys()); break;
      // case 'gang': break;
      // case 'hostile': break;
      // case 'ally': break; // Take into account gang?
      // case '!party': data.target = units.filter(unit => !actor.$party.has(unit)); break;
      case 'corpse': Object.assign(data, APP.target([...room.items].filter(item => item.id === 'corpse'), args)); break;
      case 'inventory': Object.assign(data, APP.target(await APP.hydrate(await REDIS.sMembers(`${actor}.inventory`)), args)); break;
        // const inventory = await APP.hydrate(await REDIS.sMembers(`${actor}.inventory`));
        // Object.assign(data, APP.target(inventory, args));
      case 'player': case 'npc': case 'creature': Object.assign(data, APP.target(units.filter(unit => unit.type === target), args)); break;
      default: Object.assign(data, APP.target([{ name: target }], args)); break;
    }

    if (data.target) {
      actor.$$target = data.target;
      if (isAggressive) actor.$target = data.target;
    } else if ($abort && !mods.includes('?')) {
      $abort(APP.styleText('error', `No valid ${target} found!`));
    }
  },
]);
