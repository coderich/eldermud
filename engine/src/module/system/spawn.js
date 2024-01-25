/**
 * Responsible for spawning creatures
 */
SYSTEM.on('pre:room', async (context) => {
  const { data: room } = context;

  if (room?.spawns?.length) {
    const respawn = await REDIS.get(`${room}.respawn`) || 0;

    if (respawn < new Date().getTime()) {
      // Set respawn counter
      await REDIS.set(`${room}.respawn`, new Date().getTime() + APP.roll(room.respawn));

      // Current creatures by namespace and count
      const current = Array.from(room.units.values()).filter(unit => unit.type === 'creature').reduce((prev, creature) => {
        const ns = `${creature.type}.${creature.id}`;
        prev[ns] ??= 0;
        prev[ns]--;
        return prev;
      }, {});

      await Promise.all(room.spawns.map(({ num, units }) => {
        // Roll to see if we create new spawns
        const roll = Array.from(new Array(APP.roll(num))).map(() => APP.randomElement(units)).reduce((prev, creature) => {
          const ns = `${creature.type}.${creature.id}`;
          prev[ns] ??= 0;
          prev[ns]++;
          return prev;
        }, { ...current });

        return Promise.all(Object.entries(roll).map(async ([ns, count]) => {
          if (count > 0) {
            const keys = Array.from(new Array(count)).fill(ns);
            await Promise.all(APP.hydrate(keys).map((config) => {
              config.ranks ??= [];
              config.adjectives ??= [];
              const lvl = APP.roll(config.lvl);
              const rank = APP.roll(config.rank ?? 0);
              const name = [APP.randomElement(['', ...config.adjectives]), config.ranks[rank], config.name].filter(Boolean).join(' ');
              return APP.instantiate(config, { name, room, lvl }).then(actor => actor.perform('spawn'));
            }));
          }
        }));
      }));
    }
  }
});
