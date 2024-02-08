SYSTEM.on('greet:map.eldenfortCountryside.npc.eldricTheWise', async ({ actor }) => {
  const item = await APP.instantiate('map.eldenKeep.key.ladyElethor');
  await REDIS.sAdd(`${actor}.inventory`, `${item}`);
  return actor.send('text', 'You obtain the key');
});
