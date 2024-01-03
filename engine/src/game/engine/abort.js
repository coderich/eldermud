/**
 * Catch All abort handler
 */
SYSTEM.on('*', async (event, context) => {
  const { promise, actor } = context;
  const [type] = event.split(':');

  if (type === 'post' && promise.aborted) actor.send('text', promise.reason);
});
