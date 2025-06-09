const { Action } = require('@coderich/gameflow');

Action.define('login', async (username, { actor, abort }) => {
  // Assign username
  actor.id = username;
  actor.name = username;
  actor.loginAttempts ??= 0;

  // Check if they need to set password
  const info = await actor.mGet('password', 'class', 'race');
  if (!info.password) return actor.perform('setPassword').then(() => actor.perform('onboard'));

  // Query for password + check
  return actor.query('Enter existing password for', APP.styleText('keyword', actor.name)).then(({ text: passphrase }) => {
    if (info.password === passphrase) return info.class ? actor : actor.perform('onboard');
    if (++actor.loginAttempts >= 3) return abort(actor.disconnect());
    actor.send('text', 'That password is incorrect');
    return actor.perform('login', username);
  });
});
