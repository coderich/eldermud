SYSTEM.on('enter:map.purgatory.rooms.purgatory', async ({ actor }) => {
  const id = setTimeout(() => actor.send('text', APP.styleText('senses', 'You hear a soft voice whisper "get up"')), 6000);
  const checkpoint = CONFIG.get(await actor.get('checkpoint'));

  actor.once('pre:move', async ({ abort }) => {
    abort();
    clearTimeout(id);
    actor.perform('teleport', { room: checkpoint });
  });
});
