SYSTEM.on('enter:map.purgatory.rooms.purgatory', async ({ actor }) => {
  const id = setTimeout(() => actor.send('text', APP.styleText('senses', 'You hear a soft voice whisper "get up"')), 6000);
  const checkpoint = CONFIG.get(await actor.get('checkpoint'));

  actor.once('post:stand', async () => {
    clearTimeout(id);
    actor.abortAllStreams();

    setTimeout(() => {
      actor.abortAllStreams();
      actor.perform('teleport', { room: checkpoint });
    }, 2000);
  });
});
