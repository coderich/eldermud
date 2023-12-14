SYSTEM.on('*', (event, { promise, actor }) => {
  const [type] = event.split(':');
  if (type === 'post' && promise.aborted) actor.socket.emit('text', promise.reason);
});

SYSTEM.on('pre:move', async ({ promise, actor }) => {
  const posture = await REDIS.get(`${actor}.posture`);
  if (posture !== 'stand') await actor.perform('execute', { code: 'stand', scope: 'action' });
});

SYSTEM.on('post:move', ({ promise, actor }) => {
  if (!promise.aborted) {
    actor.perform('map');
    actor.perform('room');
  }
});
