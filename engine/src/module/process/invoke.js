const { Action } = require('@coderich/gameflow');

Action.define('invoke', [
  // Actor preparations...
  async ({ invocation, target }, { actor }) => {
    if (invocation.message) await actor.interpolate(invocation.message, { actor, target, invocation }, { style: invocation.style });
    return APP.timeout(invocation.speed);
  },

  // Resource check
  async ({ invocation }, { actor, abort }) => {
    if (actor.$countdowns.has(`${invocation}`)) abort(`${invocation.name} is on cooldown!`);
    else if (await actor.get('ma') < invocation.cost) abort('Insufficient power!');
    else await actor.perform('affect', { ma: -invocation.cost });
  },

  // Manifestation (effects)
  async ({ invocation }, { actor }) => {
    if (invocation.cooldown) actor.stream('effect', 'countdown', { key: `${invocation}`, value: invocation.cooldown });

    // return Promise.all(invocation.effects.map(async (effect, index) => {
    //   const data = { target: effect.target };
    //   await actor.perform('target', data);

    //   // Loop over target(s)
    //   return Promise.all([data.target].flat().filter(Boolean).map((target) => {
    //     effect = { ...effect, source: `${invocation}:${index}`, actor: `${actor}`, target: `${target}` };
    //     return target.stream('effect', 'effect', effect);
    //   }));
    // }));

    invocation.effects.forEach(async (effect, index) => {
      const data = { target: effect.target };
      await actor.perform('target', data);

      // Loop over target(s)
      [data.target].flat().filter(Boolean).forEach((target) => {
        effect = { ...effect, source: `${invocation}:${index}`, actor: `${actor}`, target: `${target}` };
        target.stream('effect', 'effect', effect);
      });
    });
  },
]);
