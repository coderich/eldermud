const { Action } = require('@coderich/gameflow');

Action.define('rest', [
  async (_, { actor, abort }) => {
    const posture = await REDIS.set(`${actor}.posture`, 'rest', { GET: true });
    if (!posture === 'rest') abort('You are already resting!');
  },
  (_, { actor }) => {
    actor.send('text', 'You stop to rest.');

    const interval = setInterval(async () => {
      const [hp, mhp] = await REDIS.mGet([`${actor}.hp`, `${actor}.mhp`]).then(values => values.map(v => parseInt(v, 10)));
      const newHP = Math.min(hp + 5, mhp);
      await REDIS.set(`${actor}.hp`, newHP);
    }, 2000);

    actor.once('post:stand', () => clearInterval(interval));
  },
]);
