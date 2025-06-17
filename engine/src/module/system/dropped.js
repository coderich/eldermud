/**
 * Middelware to stop actions when dropped (<=0 health)
 */
SYSTEM.on('*', async (event, { actor, promise, stream, abort }) => {
  if (['action', 'preAction'].includes(stream?.id)) {
    if (await actor.get('hp') <= 0) abort(`You are too weak to ${promise.id}!`);
  }
});
