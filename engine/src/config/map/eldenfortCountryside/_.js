SYSTEM.on('greet:npc.eldricTheWise', async ({ actor }) => {
  const item = await APP.instantiate('key.ladyElethor');
  await REDIS.sAdd(`${actor}.inventory`, `${item}`);
  return actor.send('text', 'You obtain the key');
});

SYSTEM.on('pre:execute', async ({ actor, abort, data }) => {
  const { name, input } = data;
  const act = 'angeloaktree';
  const subject = { name: 'Angel Oak Tree' };

  if (name === 'unknown' && !actor.$effects.has(act)) {
    if (`${actor.room}` === 'map.eldenfortCountryside.rooms.orchards') {
      const [cmd, ...args] = input.match(/\S+/g) || [];

      if (cmd.toLowerCase() === 'touch') {
        const { target } = APP.target([subject], args);

        if (target) {
          abort();
          actor.perform('act', {
            target,
            act: {
              toString: () => act,
              target: 'self',
              message: '{actor.name} {touch} the {target.name}',
              effects: [
                {
                  style: 'buff',
                  target: 'self',
                  permanent: true,
                  effect: { wis: 1 },
                  message: 'You gain 1 wisdom point!',
                },
              ],
            },
          });
        }
      }
    }
  }
});
