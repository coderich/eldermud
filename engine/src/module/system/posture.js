/**
 * Middelware to catch your posture and perform stand before action
 */
SYSTEM.on('*', async (event, context) => {
  const { actor } = context;

  if (['pre:move', 'pre:open', 'pre:close', 'pre:attack'].includes(event)) {
    const posture = await actor.get('posture');
    if (posture !== 'stand') await actor.stream('preAction', 'stand');
  }
});
