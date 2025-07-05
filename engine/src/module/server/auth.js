const { Action } = require('@coderich/gameflow');

Action.define('authenticate', [
  async (_, { actor }) => {
    const { text: username } = await actor.query('Login with your username or type', APP.styleText('keyword', 'new'));
    if (username.toLowerCase() === 'new') return actor.perform('signup');
    if (await REDIS.sIsMember('users', username)) return actor.perform('login', username);
    actor.send('text', 'Sorry, that username does not exist');
    return actor.perform('authenticate');
  },
]);

Action.define('signup', async (_, { actor }) => {
  let { text: username } = await actor.query('Create a new username');
  username = APP.ucFirst(username.toLowerCase());
  const { text: yn } = await actor.query(APP.styleText('keyword', username), APP.styleText('dialog', 'is that correct? (y/n)'));
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
  return actor.perform('setPassword');
});

Action.define('setPassword', async (_, { actor }) => {
  const { text: password } = await actor.query('Enter a password for', APP.styleText('keyword', actor.name));
  const { text: confirm } = await actor.query('Re-enter password (confirmation)');

  // Password check
  if (password !== confirm) {
    actor.send('text', 'Oops, passwords do not match');
    return actor.perform('setPassword');
  }

  // Set password
  return REDIS.set(`${actor}.password`, password);
});

Action.define('login', async (username, { actor, abort }) => {
  // Assign username
  actor.id = username;
  actor.name = username;
  actor.loginAttempts ??= 0;

  // Check if they need to set password
  const password = await actor.get('password');

  if (!password) return actor.perform('setPassword');

  // Query for password + check
  return actor.query('Enter existing password for', APP.styleText('keyword', actor.name)).then(({ text: passphrase }) => {
    if (password === passphrase) return Promise.resolve();
    if (++actor.loginAttempts >= 3) return abort(actor.disconnect());
    actor.send('text', 'That password is incorrect');
    return actor.perform('login', username);
  });
});

Action.define('logout', async ({ reason }, { actor }) => {
  CONFIG.get(await actor.get('room')).units?.delete(actor);
  if (!reason) return actor.realm('text', APP.styleText('gesture', `${actor.name} just hung up!`));
  return actor.realm('text', `${actor.name} has left the realm.`);
});
