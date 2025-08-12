const { Action } = require('@coderich/gameflow');

SYSTEM.on('post:enter', ({ actor }) => {
  // Talent cooldowns
  REDIS.keys(`talent.*.${actor}.cooldown`).then(async (keys) => {
    const values = keys.length ? await REDIS.mGet(keys) : keys;
    keys.forEach((key, i) => actor.stream('effect', 'countdown', { key, value: Number(values[i]) }));
  });

  // Talent effects
  REDIS.keys(`talent.*.${actor}`).then(async (keys) => {
    const values = keys.length ? await REDIS.mGet(keys) : keys;
    keys.forEach((key, i) => actor.stream('effect', 'effect', JSON.parse(values[i])));
  });
});

Action.define('talent', [
  // Gesture
  async ({ talent, target }, { actor }) => {
    if (talent.gesture) await actor.interpolate(APP.styleText('gesture', talent.gesture), { actor, target, talent });
    return APP.timeout(talent.speed);
  },

  // Resource check
  async ({ talent }, { actor, abort }) => {
    if (await REDIS.get(`${talent}.${actor}.cooldown`)) abort(`${talent.name} is on cooldown!`);
    else if (await actor.get('ma') < talent.cost) abort('Insufficient power!');
    else await actor.perform('affect', { ma: -talent.cost });
  },

  // Message
  async ({ talent, target }, { actor }) => {
    if (talent.message) await actor.interpolate(APP.styleText(talent.style, talent.message), { actor, target, talent });
  },

  // Manifestation (effects)
  async ({ talent, target }, { actor }) => {
    actor.stream('effect', 'countdown', {
      key: `${talent}.${actor}.cooldown`,
      value: talent.cooldown,
      save: true,
    });

    return talent.effects.map(async (effect) => {
      const $target = effect.target === 'self' ? actor : target;
      effect = { ...effect, source: `${talent}`, actor: `${actor}`, target: `${$target}` };
      return $target.stream('effect', 'effect', effect);
    });
  },
]);
