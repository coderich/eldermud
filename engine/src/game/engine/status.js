/**
 * Middelware to catch your posture and perform stand before action
 */
SYSTEM.on('*', async (event, context) => {
  const { actor } = context;

  if (['post:affect', 'post:spawn', 'post:stand', 'post:rest'].includes(event)) {
    actor.perform('status');
  }
});
