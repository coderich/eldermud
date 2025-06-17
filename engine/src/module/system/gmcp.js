/**
 */
SYSTEM.on('*', async (event, context) => {
  const { actor, result } = context;
  const [type] = event.split(':');

  if (['post:move'].includes(event)) {
    // Visual for the actor
    actor.perform('map');
    actor.perform('room', result.to);
  }

  if (type === 'enter') {
    const { room, exit } = result;

    // Broadcast to room that you have arrived
    Array.from(room.units.values()).filter(unit => unit !== actor && !actor.$party.has(unit)).forEach((unit) => {
      let direction = APP.rdirection[result.dir];
      if (direction === 'up') direction = 'above';
      else if (direction === 'down') direction = 'below';
      else direction = `the ${direction}`;
      unit.send('text', `${APP.styleText(actor.type, actor.name)} enters from ${direction}.`);
    });

    // Notify those around you (except for room you just came from)
    if (room.exits) {
      Object.entries(room.exits).filter(([d, x]) => `${x}` !== `${exit}`).forEach(([d, x]) => {
        let direction = APP.rdirection[d];
        if (direction === 'up') direction = 'above';
        else if (direction === 'down') direction = 'below';
        x.units?.forEach(unit => unit.send('text', APP.styleText('noise', `You hear movement ${direction}.`)));
      });
    }
  }

  if (type === 'leave') {
    const { exit } = result;

    // Broadcast to room that actor left
    Array.from(exit.units.values()).filter(unit => unit !== actor && !actor.$party.has(unit)).forEach((unit) => {
      unit.send('text', `${APP.styleText(actor.type, actor.name)} leaves the room heading ${APP.direction[result.dir]}.`);
    });
  }
});
