const { Action } = require('@coderich/gameflow');

const resolveUsername = async (actor) => {
  let { text: username } = await actor.socket.query('cmd', 'Please enter your username (otherwise type "new")');
  const isNew = username.toLowerCase() === 'new';

  if (isNew) {
    ({ text: username } = await actor.socket.query('cmd', 'Please enter a username'));
    if (!await REDIS.sAdd('users', username.toLowerCase())) {
      actor.socket.emit('text', 'Sorry, that username already exists');
      return resolveUsername(actor);
    }
  } else if (!await REDIS.sIsMember('users', username.toLowerCase())) {
    actor.socket.emit('text', 'Sorry, unable to find that username');
    return resolveUsername(actor);
  }

  return { username, isNew };
};

const resolvePassword = async (actor, username, isNew) => {
  const key = `${username.toLowerCase()}.password`;
  const { text: password } = await actor.socket.query('cmd', 'Please enter password');

  if (isNew) {
    const { text: confirm } = await actor.socket.query('cmd', 'Please password confirm');
    if (confirm !== password) {
      actor.socket.emit('text', 'Oops, passwords do not match');
      return resolvePassword(actor, username, isNew);
    }
    await REDIS.set(key, password);
  } else if ((await REDIS.get(key)) !== password) {
    actor.socket.emit('text', 'Oops, that password is not valid');
    return resolvePassword(actor, username, isNew);
  }

  return password;
};

Action.define('login', async (_, { actor }) => {
  // Welcome
  actor.socket.emit('text', 'Welcome adventurer!');

  // Resolve username + password
  const { username, isNew } = await resolveUsername(actor);
  await resolvePassword(actor, username, isNew);

  // Setup profile
  actor.id = username.toLowerCase();
  actor.name = username;
  if (isNew) Object.assign(actor, CONFIG.get('player'));
});
