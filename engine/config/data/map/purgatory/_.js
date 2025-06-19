SYSTEM.on('enter:map.purgatory.rooms.purgatory', ({ actor }) => {
  actor.once('pre:stand', async () => {
    actor.abortAllStreams();
    const checkpoint = CONFIG.get(await actor.get('checkpoint'));
    actor.perform('teleport', { room: checkpoint });
  });
});
