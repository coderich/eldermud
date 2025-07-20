const { Action, Loop } = require('@coderich/gameflow');

Action.define('resilient', new Loop([
  (_, { actor }) => {
    return new Promise((resolve) => {
      SYSTEM.once('pre:hit', async ({ data }) => {
        resolve();

        if (actor === data.target) {
          const { hp, mhp } = await actor.mGet(['hp', 'mhp']);
          const pct = ((hp - data.dmg) / mhp) * 100;
          if (pct <= 50) data.dmg = Math.floor(data.dmg * 0.9);
        }
      });
    });
  },
]));
