const { Action } = require('@coderich/gameflow');

Action.define('signup', async (_, { actor }) => {
  let { text: username } = await actor.query('Enter a username for yourself');
  username = APP.ucFirst(username.toLowerCase());
  const { text: yn } = await actor.query('Username', APP.styleText('keyword', username), APP.styleText('query', 'does that look ok? (y/n)'));
  if (!yn.toLowerCase('y').startsWith('y')) return actor.perform('signup');

  // Username check
  if (!await REDIS.sAdd('users', username)) {
    actor.socket.emit('text', 'Sorry, that username already exists');
    return actor.perform('signup');
  }

  // Assign username
  actor.id = username;
  actor.name = username;

  // Set password
  await actor.perform('setPassword');

  // Onboard new player
  return actor.perform('onboard');
});
