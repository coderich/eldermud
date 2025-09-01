const { Actor } = require('@coderich/gameflow');

/**
 */
SYSTEM.on('*', async (event, context) => {
  const { actor, result, promise, stream, abort } = context;
  const [type] = event.split(':');

  // Must await mandatory stream cannot be aborted
  if (type === 'pre' && ['action', 'tactic'].includes(stream?.id)) {
    await actor.stream(actor.mandatoryStream, 'noop');
  }

  // Abort GMCP
  if (type === 'abort' && promise.reason && promise.reason !== '$source') {
    actor.writeln(promise.reason);
  }

  // Fallen logic
  if (['action'].includes(stream?.id)) {
    if (await actor.get('hp') <= 0) abort(`You are too weak to ${promise.id}!`);
  }

  // Stance
  if (['start:engage'].includes(event)) {
    actor.save({ stance: CONFIG.get('app.stance.engaged') }).then(() => actor.perform('status'));
  } else if (['post:engage', 'abort:engage', 'post:death'].includes(event)) {
    actor.save({ stance: CONFIG.get('app.stance.ready') }).then(() => actor.perform('status'));
  }

  // Status
  if (['post:affect', 'post:effect', 'post:spawn', 'start:effect', 'abort:effect', 'abort:countdown'].includes(event)) {
    actor.perform('status');
  }

  // Enter realm
  if (['post:enter'].includes(event)) {
    const duplicate = Object.values(Actor).find(a => a !== actor && a.id === actor.id);
    if (duplicate) duplicate.disconnect('duplicate');
  }

  // Enter room
  if (type === 'enter') {
    const { room, exit } = result;

    // Broadcast to room that you have arrived
    Array.from(room.units.values()).filter(unit => unit !== actor && !actor.$party.has(unit)).forEach((unit) => {
      const direction = APP.theRDirection[result.code] || 'nowhere!';
      unit.writeln(`${APP.styleText(actor.type, actor.name)} enters the room from ${direction}`);
    });

    // Notify those around you (except for room you just came from)
    if (room.exits) {
      Object.entries(room.exits).filter(([d, x]) => `${x}` !== `${exit}`).forEach(([d, x]) => {
        let direction = APP.rdirection[d];
        if (direction === 'up') direction = 'above';
        else if (direction === 'down') direction = 'below';
        x.units?.forEach(unit => unit.writeln(APP.styleText('noise', `You hear movement ${direction}`)));
      });
    }
  }

  // Leave room
  if (type === 'exit') {
    const { exit } = result;

    // Broadcast to room that actor left
    Array.from(exit.units.values()).filter(unit => unit !== actor && !actor.$party.has(unit)).forEach((unit) => {
      unit.writeln(`${APP.styleText(actor.type, actor.name)} leaves the room heading ${APP.direction[result.code]}`);
    });
  }
});
