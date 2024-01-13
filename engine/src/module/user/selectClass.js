const { Action } = require('@coderich/gameflow');

Action.define('selectClass', async (_, { actor }) => {
  const classes = CONFIG.get('class');
  const line = Array.from(new Array(100)).join('-');

  actor.send('text', `\n${line}\n`);

  Object.values(classes).forEach((hero, i) => {
    actor.send('text', APP.styleText('keyword', hero.name));
    actor.send('text', `${hero.description}\n`);
  });

  actor.send('text', `${line}\n`);
  const { text: classname } = await actor.query(APP.styleText('query', 'Welcome', APP.styleText('keyword', actor.name), APP.styleText('query', '- enter a class name you\'d like to play')));
  const { target } = APP.target(Object.values(classes), [classname]);
  if (!target) return actor.perform('selectClass');
  return Object.assign(actor, Object.assign(target, CONFIG.get('player'), actor, { class: `${target}` }));
});
