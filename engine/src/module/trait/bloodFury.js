const { Action } = require('@coderich/gameflow');

Action.define('bloodFury', [
  (_, { actor }) => {
    actor.on('pre:hit', async ({ data }) => {
      const { hp, mhp } = await actor.mGet(['hp', 'mhp']);
      const pct = (hp / mhp) * 100;
      if (pct <= 30) data.dmg = Math.ceil(data.dmg * 1.20);
    });
  },
]);
