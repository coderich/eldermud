const { Action } = require('@coderich/gameflow');

Action.define('heartbeat', [
  (_, { actor, promise }) => {
    APP.timeout(2500).then(async () => {
      if (!promise.aborted) {
        const [hp, mhp, ma, mma] = await REDIS.mGet([
          `${actor}.hp`,
          `${actor}.mhp`,
          `${actor}.ma`,
          `${actor}.mma`,
        ]).then(values => values.map(v => parseInt(v, 10)));
        const incrHP = Math.min(mhp - hp, 2);
        const incrMA = Math.min(mma - ma, 2);
        actor.perform('affect', { hp: incrHP, ma: incrMA });
      }

      actor.stream('trait', 'heartbeat');
    });
  },
]);
