/**
 */
SYSTEM.on('*', async (event, context) => {
  const { actor, result } = context;

  if (['post:move'].includes(event)) {
    actor.perform('map');
    actor.perform('room', result.exit);
  }
});
