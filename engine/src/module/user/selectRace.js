const { Action } = require('@coderich/gameflow');

Action.define('selectRace', async (_, { actor }) => {
  const races = CONFIG.get('race');
  const line = Array.from(new Array(100)).join('-');

  actor.send('text', `\n${line}\n`);

  Object.values(races).forEach((target, i) => {
    actor.perform('help', { target });
  });

  actor.send('text', `${line}\n`);
  const { text: racename } = await actor.query(APP.styleText('query', 'Welcome', APP.styleText('keyword', actor.name), APP.styleText('query', '- enter a race name you\'d like to play!')));
  const { target } = APP.target(Object.values(races), [racename]);
  if (!target) return actor.perform('selectRace');
  Object.assign(actor, { ...target, ...actor });
  await REDIS.set(`${actor}.race`, `${target}`);
  return target;
});
