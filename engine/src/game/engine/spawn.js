const Creature = require('../../model/Creature');

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
            const args = Array.from(new Array(count)).fill(ns);
            const creatures = await APP.instantiate(...args);
            await Promise.all(creatures.map(async (creature) => {
              creature.tier = APP.roll(creature.tier);
              creature.name = [APP.randomElement(creature.adjectives), creature.tiers[creature.tier], creature.name].filter(Boolean).join(' ');
              const spawn = new Creature({ ...creature, room });
              await spawn.perform('spawn');
              await spawn.perform('enter');
            }));
          }
        }));
      }));
    }
  }
});
