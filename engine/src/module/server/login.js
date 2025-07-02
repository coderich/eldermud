const { Action } = require('@coderich/gameflow');

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
