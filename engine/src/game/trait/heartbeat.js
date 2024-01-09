const { Action } = require('@coderich/gameflow');

Action.define('heartbeat', [
  async (_, { actor }) => {
    await APP.timeout(5000);
  },
  async (_, { actor }) => {
    const [hp, mhp, ma, mma] = await REDIS.mGet([
      `${actor}.hp`,
      `${actor}.mhp`,
      `${actor}.ma`,
      `${actor}.mma`,
    ]).then(values => values.map(v => parseInt(v, 10)));
    const incrHP = Math.min(mhp - hp, 2);
    const incrMA = Math.min(mma - ma, 2);
    actor.perform('affect', { hp: incrHP, ma: incrMA });
    actor.stream('trait', 'heartbeat');
  },
]);
