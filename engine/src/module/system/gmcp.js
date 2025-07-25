/**
 */
SYSTEM.on('*', async (event, context) => {
  const { actor, result, promise, stream, abort } = context;
  const [type] = event.split(':');

  // // Posture
  // if (['pre:move', 'pre:open', 'pre:close', 'pre:attack'].includes(event)) {
  //   const posture = await actor.get('posture');
  //   if (posture !== 'stand') await actor.stream('preAction', 'stand');
  // }

  // Abort GMCP
  if (type === 'abort' && promise.reason && promise.reason !== '$source') {
    actor.send('text', promise.reason);
  }

  // Dropped logic
  if (['action', 'preAction'].includes(stream?.id)) {
    if (await actor.get('hp') <= 0) abort(`You are too weak to ${promise.id}!`);
  }

  // Stance
  if (['start:engage'].includes(event)) {
    actor.save({ stance: CONFIG.get('app.stance.engaged') }).then(() => actor.perform('status'));
  } else if (['post:engage', 'abort:engage', 'post:death'].includes(event)) {
    actor.save({ stance: CONFIG.get('app.stance.ready') }).then(() => actor.perform('status'));
  }

  // Movement GMCP
  if (['post:move'].includes(event)) {
    actor.perform('map');
    actor.perform('room', result.to);
  }

  if (['post:engage', 'abort:engage'].includes(event)) {
    actor.send('text', APP.styleText('engaged', '*combat off*'));
  }

  // Status
  if (['post:affect', 'post:effect', 'post:spawn', 'start:effect', 'abort:effect', 'abort:countdown'].includes(event)) {
    if (actor.type === 'player') {
      actor.perform('status');
    }
  }

  // Enter room
  if (type === 'enter') {
    const { room, exit } = result;

    // Broadcast to room that you have arrived
    Array.from(room.units.values()).filter(unit => unit !== actor && !actor.$party.has(unit)).forEach((unit) => {
      const direction = APP.theRDirection[result.dir] || 'nowhere!';
      unit.send('text', `${APP.styleText(actor.type, actor.name)} enters the room from ${direction}`);
    });

    // Notify those around you (except for room you just came from)
    if (room.exits) {
      Object.entries(room.exits).filter(([d, x]) => `${x}` !== `${exit}`).forEach(([d, x]) => {
        let direction = APP.rdirection[d];
        if (direction === 'up') direction = 'above';
        else if (direction === 'down') direction = 'below';
        x.units?.forEach(unit => unit.send('text', APP.styleText('noise', `You hear movement ${direction}`)));
      });
    }
  }

  // Leave room
  if (type === 'leave') {
    const { exit } = result;

    // Broadcast to room that actor left
    Array.from(exit.units.values()).filter(unit => unit !== actor && !actor.$party.has(unit)).forEach((unit) => {
      unit.send('text', `${APP.styleText(actor.type, actor.name)} leaves the room heading ${APP.direction[result.dir]}`);
    });
  }
});
