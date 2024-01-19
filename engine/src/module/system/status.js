/**
 * Middelware status affect listener
 */
SYSTEM.on('*', async (event, context) => {
  const { actor } = context;

  if (['post:affect', 'post:effect', 'post:spawn', 'post:stand', 'post:rest'].includes(event)) {
    await actor.calcStats?.();

    // Status
    if (actor.type === 'player') {
      actor.perform('status');
    }
  }
});
