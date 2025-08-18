const { Action } = require('@coderich/gameflow');

Action.define('act', [
  // Actor preparations...
  async ({ act, target }, { actor }) => {
    if (act.message) await actor.interpolate(act.message, { actor, target }, { style: act.style });
    return APP.timeout(act.speed);
  },

  // Resource check
  async ({ act }, { actor, abort }) => {
    if (actor.$countdowns.has(`${act}`)) abort(`${act.name} is on cooldown!`);

    if (act.affect) {
      const info = await actor.mGet(Object.keys(act.affect));
      if (Object.entries(act.affect).some(([key, value]) => ((info[key] += value) < 0))) abort('Insufficient resources!');
      else await actor.perform('affect', act.affect);
    }
  },

  // Manifestation (effects)
  async ({ act }, { actor }) => {
    if (act.cooldown) actor.stream('effect', 'countdown', { key: `${act}`, value: act.cooldown });

    act.effects.forEach(async (effect, index) => {
      const data = { target: effect.target };
      await actor.perform('target', data);

      // Loop over target(s)
      [data.target].flat().filter(Boolean).forEach((target) => {
        const source = `${act}:${index}`;
        effect = { ...effect, source, actor: `${actor}`, target: `${target}` };
        target.stream('effect', 'effect', effect);
      });
    });
  },
]);
