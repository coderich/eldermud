const { Action } = require('@coderich/gameflow');

Action.define('selectRace', async (_, { actor }) => {
  const races = CONFIG.get('race');
  const line = Array.from(new Array(100)).join('-');

  await actor.send('text', `\n${line}\n`);
  await Promise.all(Object.values(races).map(target => actor.perform('help', { target })));
  await actor.send('text', `${line}\n`);

  const { text: racename } = await actor.query(APP.styleText('query', 'Welcome', APP.styleText('keyword', actor.name), APP.styleText('query', '- enter a race name you\'d like to play!')));
  const { target } = APP.target(Object.values(races), [racename]);
  if (!target) return actor.perform('selectRace');
  await actor.save({ race: target, ...target, ...actor });
  return target;
});
