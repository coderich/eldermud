SYSTEM.on('pre:move', ({ actor, data }) => {
  if (`${actor.room}` === 'map.eldenfortResidence.rooms.collapsedHallway' && data === 'w') {
    console.log('rope check');
  }
});

SYSTEM.on('path:eldenfortResidence', async ({ actor }) => {
  actor.send('text', 'You traverse it');
});

SYSTEM.on('search:eldenfortResidence', async ({ actor, result }) => {
  const room = CONFIG.get('map.eldenfort.rooms.westernDeadEnd');
  const exit = CONFIG.get('map.eldenfortResidence.rooms.foyer');

  if (!room.exits.w) {
    room.exits.w = exit;
    actor.perform('map');
    actor.send('text', 'You locate a hidden passage!');

    APP.timeout(60000).then(() => {
      delete room.exits.w;
      actor.perform('map');
    });
  }
});
