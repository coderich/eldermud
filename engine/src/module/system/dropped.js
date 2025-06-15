/**
 * Middelware to stop actions when dropped (<=0 health)
 */
SYSTEM.on('*', async (event, context) => {
  const { actor, stream, abort } = context;

  if (actor.hp <= 0 && stream?.id === 'action') {
    abort('You are too weak to do that!');
  }
});
