SYSTEM.on('*', async (event, context) => {
  const { promise, actor, result } = context;
  const [type, action] = event.split(':');

  // Posture check...
  if (['pre:move', 'pre:open', 'pre:close'].includes(event)) {
    const posture = await REDIS.get(`${actor}.posture`);
    if (posture !== 'stand') await actor.perform('stand');
  }

  // Catch-all abort
  if (type === 'post' && promise.aborted) actor.socket.emit('text', promise.reason);

  // Fanout
  if (type === 'post' && !promise.aborted) {
    switch (action) {
      case 'move': {
        SYSTEM.emit(`enter:${result.exit}`, context);
        SYSTEM.emit(`leave:${result.room}`, context);
        break;
      }
      case 'greet': {
        SYSTEM.emit(`greet:${result.target}`, context);
        break;
      }
      case 'ask': {
        context.args = result.args;
        SYSTEM.emit(`ask:${result.target}`, context);
        break;
      }
      case 'search': {
        SYSTEM.emit(`search:${result.target}`, context);
        break;
      }
      default: break;
    }
  }
});
