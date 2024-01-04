/**
 * Middelware to catch your posture and perform stand before action
 */
SYSTEM.on('*', async (event, context) => {
  const { actor } = context;

  if (['pre:move', 'pre:open', 'pre:close'].includes(event)) {
    const posture = await REDIS.get(`${actor}.posture`);
    if (posture !== 'stand') await actor.stream('preAction', 'stand');
  }
});
