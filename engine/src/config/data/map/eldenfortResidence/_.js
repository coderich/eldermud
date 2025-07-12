SYSTEM.on('pre:move', async ({ actor, data, abort }) => {
  if (`${actor.room}` === 'map.eldenfortResidence.rooms.collapsedHallway' && data === 'w') {
    const inventory = await APP.hydrate(await REDIS.sMembers(`${actor}.inventory`));
    if (!inventory.find(item => item.id === 'rope')) abort(APP.styleText('error', 'You are unable to pass!'));
    else actor.send('text', APP.styleText('boost', 'You traverse the hallway with your rope and grapple'));
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
