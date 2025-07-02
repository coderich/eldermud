const { Action } = require('@coderich/gameflow');

Action.define('setPassword', async (_, { actor }) => {
  const { text: password } = await actor.query('Enter a new password for', APP.styleText('keyword', actor.name));
  const { text: confirm } = await actor.query('Re-enter password (confirmation)');

  // Password check
  if (password !== confirm) {
    actor.send('text', 'Oops, passwords do not match');
    return actor.perform('setPassword');
  }

  // Set password
  return REDIS.set(`${actor}.password`, password);
});
