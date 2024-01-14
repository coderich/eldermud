/**
 * Middelware status affect listener
 */
SYSTEM.on('*', async (event, context) => {
  const { actor, result } = context;

  if (['post:affect', 'post:effect', 'post:spawn', 'post:stand', 'post:rest'].includes(event)) {
    await actor.calcStats?.();

    // Status
    if (actor.type === 'player') {
      actor.perform('status');
    }

    // Death check
    if (event === 'post:affect' && result.hp <= 0) {
      actor.perform('death');
    }
  }
});
