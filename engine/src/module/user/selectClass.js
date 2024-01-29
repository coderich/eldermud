const { Action } = require('@coderich/gameflow');

Action.define('selectClass', async (_, { actor }) => {
  const classes = CONFIG.get('class');
  const line = Array.from(new Array(100)).join('-');

  actor.send('text', `\n${line}\n`);

  Object.values(classes).forEach((hero, i) => {
    const { name, str, dex, int, wis, description, abilities, traits } = hero;
    const stats = Object.entries({ str, dex, int, wis }).map(([key, value]) => APP.styleText('stat', `${key}:`).concat(' ', APP.styleText('keyword', value)));
    actor.send('text', APP.styleText('highlight', name), '(', stats.join(', '), ')');
    actor.send('text', `${description}`);
    actor.send('text', APP.styleText('stat', 'Begin with:'), '[', APP.styleText('keyword', abilities.concat(traits).map(el => el.name).join(', ')), ']\n');
  });

  actor.send('text', `${line}\n`);
  const { text: classname } = await actor.query(APP.styleText('query', 'Welcome', APP.styleText('keyword', actor.name), APP.styleText('query', '- enter a class name you\'d like to play!')));
  const { target } = APP.target(Object.values(classes), [classname]);
  if (!target) return actor.perform('selectClass');
  return REDIS.set(`${actor}.class`, `${target}`);
});
