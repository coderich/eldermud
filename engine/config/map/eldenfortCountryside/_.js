SYSTEM.on('greet:npc.eldenfortCountryside.eldricTheWise', async ({ actor }) => {
  const item = await APP.instantiate('key.eldenkeep.ladyElethor');
  await REDIS.sAdd(`${actor}.inventory`, `${item}`);
  return actor.send('text', 'You obtain the key');
});
