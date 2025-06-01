/**
 * Middelware status affect listener
 */
SYSTEM.on('*', async (event, context) => {
  const { actor } = context;

  if (['post:affect', 'post:effect', 'post:spawn', 'post:stand', 'post:rest'].includes(event)) {
    // await actor.calcStats?.(); // Not sure why i did this?

    // Status
    if (actor.type === 'player') {
      actor.perform('status');
    }
  }
});
