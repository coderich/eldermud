/**
 * Middelware to stop actions when dropped (<=0 health)
 */
SYSTEM.on('*', async (event, context) => {
  const { actor, promise, stream, abort } = context;

  if (actor.hp <= 0 && ['action', 'preAction'].includes(stream?.id)) {
    abort(`You are too weak to ${promise.id}!`);
  }
});
