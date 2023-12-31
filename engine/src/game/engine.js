SYSTEM.on('*', async (event, context) => {
  const { promise, actor, data, result, translate } = context;
  const [type, action] = event.split(':');

  // Normalize input for actions
  if (type === 'pre' && translate) {
    switch (action) {
      case 'greet': case 'ask': case 'attack': {
        const { args } = data;
        const { units } = CONFIG.get(await REDIS.get(`${actor}.room`));
        Object.assign(data, APP.target(units, args));
        break;
      }
      default: break;
    }
  }

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
      case 'enter': { // Enter the realm
        SYSTEM.emit(`enter:${result.room}`, context);
        break;
      }
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
