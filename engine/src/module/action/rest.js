// const { Action } = require('@coderich/gameflow');

// Action.define('rest', [
//   async (_, { actor, abort }) => {
//     const posture = await REDIS.set(`${actor}.posture`, 'rest', { GET: true });
//     if (posture === 'rest') abort('You are already resting!');
//   },
//   (_, { actor }) => {
//     actor.send('text', 'You stop to rest.');

//     const interval = setInterval(async () => {
//       const hp = await actor.get('hp').then(v => parseInt(v, 10));
//       const incrHP = Math.min(actor.mhp - hp, 5);
//       await actor.perform('affect', { hp: incrHP });
//     }, 2000);

//     actor.once('post:stand', () => clearInterval(interval));
//   },
// ]);
