const { Action } = require('@coderich/gameflow');

Action.define('authenticate', [
  async (_, { actor }) => {
    const { text: username } = await actor.query('Please enter your username or type', APP.styleText('keyword', 'new'));
    if (username.toLowerCase() === 'new') return actor.perform('signup');
    if (await REDIS.sIsMember('users', username)) return actor.perform('login', username);
    actor.send('text', 'Sorry, that username does not exist');
    return actor.perform('authenticate');
  },
]);
