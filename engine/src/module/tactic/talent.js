const { Action } = require('@coderich/gameflow');

SYSTEM.on('post:enter', ({ actor }) => {
  // Talent effects
  REDIS.keys(`talent.*.${actor}`).then(async (keys) => {
    const values = keys.length ? await REDIS.mGet(keys) : keys;
    keys.forEach((key, i) => actor.stream('effect', 'effect', JSON.parse(values[i])));
  });
});

Action.define('talent', [
  // Actor preparations...
  async ({ talent, target }, { actor }) => {
    if (talent.message) await actor.interpolate(talent.message, { actor, target, talent }, { style: talent.style });
    return APP.timeout(talent.speed);
  },

  // Resource check
  async ({ talent }, { actor, abort }) => {
    if (actor.$countdowns.has(`${talent}`)) abort(`${talent.name} is on cooldown!`);
    else if (await actor.get('ma') < talent.cost) abort('Insufficient power!');
    else await actor.perform('affect', { ma: -talent.cost });
  },

  // Manifestation (effects)
  async ({ talent }, { actor }) => {
    actor.stream('effect', 'countdown', { key: `${talent}`, value: talent.cooldown });

    return talent.effects.map(async (effect, index) => {
      const data = { target: effect.target };
      await actor.perform('target', data);

      // Loop over target(s)
      return Promise.all([data.target].flat().map((target) => {
        effect = { ...effect, source: `${talent}:${index}`, actor: `${actor}`, target: `${target}` };
        return target.stream('effect', 'effect', effect);
      }));
    });
  },
]);
