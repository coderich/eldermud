/**
 * Catch All abort handler
 */
SYSTEM.on('*', async (event, context) => {
  const { promise, actor } = context;
  const [type] = event.split(':');

  if (type === 'abort' && promise.reason && promise.reason !== '$source') {
    await actor.send('text', promise.reason);
  }
});
