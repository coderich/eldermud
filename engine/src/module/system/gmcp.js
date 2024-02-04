/**
 */
SYSTEM.on('*', async (event, context) => {
  const { actor, result } = context;

  if (['post:move'].includes(event)) {
    setImmediate(() => {
      const { dir, room, exit } = result;
      const sneak = APP.roll(actor.stealth);

      if (sneak < 80) {
        // Broadcast to room that actor left
        Array.from(room.units.values()).filter(unit => unit !== actor && !actor.$party.has(unit)).forEach((unit) => {
          unit.send('text', `${APP.styleText(actor.type, actor.name)} leaves the room heading ${APP.direction[dir]}.`);
        });

        // Broadcast to new room that you have arrived
        Array.from(exit.units.values()).filter(unit => unit !== actor && !actor.$party.has(unit)).forEach((unit) => {
          let direction = APP.rdirection[dir];
          if (direction === 'up') direction = 'above';
          else if (direction === 'down') direction = 'below';
          else direction = `the ${direction}`;
          unit.send('text', `${APP.styleText(actor.type, actor.name)} enters from ${direction}.`);
        });

        // Notify those around you (except for room you just came from)
        Object.entries(exit.exits).filter(([d, x]) => `${x}` !== `${room}`).forEach(([d, x]) => {
          let direction = APP.rdirection[d];
          if (direction === 'up') direction = 'above';
          else if (direction === 'down') direction = 'below';
          x.units?.forEach(unit => unit.send('text', APP.styleText('noise', `You hear movement ${direction}.`)));
        });
      }

      // Visual for the actor
      actor.perform('map');
      actor.perform('room', exit);
    });
  }
});
