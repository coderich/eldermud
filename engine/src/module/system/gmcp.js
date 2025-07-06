/**
 */
SYSTEM.on('*', (event, context) => {
  const { actor, result, promise } = context;
  const [type] = event.split(':');

  if (type === 'abort' && promise.reason && promise.reason !== '$source') {
    actor.send('text', promise.reason);
  }

  if (['post:move'].includes(event)) {
    actor.perform('map');
    actor.perform('room', result.to);
  }

  if (['post:engage', 'abort:engage'].includes(event)) {
    actor.send('text', APP.styleText('engaged', '*combat off*'));
  }

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

  if (type === 'leave') {
    const { exit } = result;

    // Broadcast to room that actor left
    Array.from(exit.units.values()).filter(unit => unit !== actor && !actor.$party.has(unit)).forEach((unit) => {
      unit.send('text', `${APP.styleText(actor.type, actor.name)} leaves the room heading ${APP.direction[result.dir]}`);
    });
  }
});
