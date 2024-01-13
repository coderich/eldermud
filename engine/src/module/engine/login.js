SYSTEM.on('post:authenticate', async ({ actor }) => {
  await actor.send('cls');
  await actor.perform('spawn');
});
