/**
 * Responsible for spawning map creatures
 */
setInterval(async () => {
  Object.values(CONFIG.get('map')).forEach(({ spawns, rooms }) => {
    if (spawns?.length) {
      const mapUnits = Object.values(rooms).reduce((prev, room) => prev.concat(Array.from(room.units)), []);

      spawns.forEach(({ num, max, units }) => {
        const roll = APP.roll(num);
        const ids = units.map(unit => unit.id);
        const existingUnits = mapUnits.filter(unit => ids.includes(unit.id));
        const maximum = max - existingUnits.length;
        const count = Math.min(roll, maximum);

        // Spawn
        if (count > 0) {
          Array.from(new Array(count)).forEach(() => {
            const unit = APP.randomElement(units);
            const room = APP.randomElement(Object.values(rooms));
            const { random = {} } = unit;
            const name = [APP.randomElement(['', ...random.impressions]), unit.name].filter(Boolean).join(' ').toLowerCase();
            APP.instantiate(unit, { room, name }).then(actor => actor.perform('spawn'));
          });
        }
      });
    }
  });
}, 3000);

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
