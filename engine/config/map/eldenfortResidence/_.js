SYSTEM.on('look:map.eldenfortResidence.chest.small', async ({ actor, result }) => {
  if (actor.type === 'player') {
    const { target } = result;
    const isNew = await REDIS.sAdd(`${target}.players`, `${actor}`);
    if (isNew) {
      await APP.instantiate(target.items, { room: `${actor.room}`, owner: `${actor}` }).then((items) => {
        return Promise.all(items.map(item => item.perform('spawn')));
      });
      actor.send('text', 'You empty the contents of the chest.');
    }
  }
});
