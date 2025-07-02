const { Action } = require('@coderich/gameflow');

Action.define('selectClass', async (_, { actor }) => {
  const classes = CONFIG.get('class');
  const line = Array.from(new Array(100)).join('-');

  await actor.send('text', `\n${line}\n`);
  await Promise.all(Object.values(classes).map(target => actor.perform('help', { target })));
  await actor.send('text', `\n${line}\n`);

  const { text: classname } = await actor.query(APP.styleText('dialog', 'Welcome', APP.styleText('keyword', actor.name), APP.styleText('dialog', '- enter a class name you\'d like to play!')));
  const { target } = APP.target(Object.values(classes), [classname]);
  if (!target) return actor.perform('selectClass');
  await actor.save({
    class: `${target}`,
    str: target.str,
    dex: target.dex,
    int: target.int,
    wis: target.wis,
    con: target.con,
    cha: target.cha,
    traits: target.traits,
    talents: target.talents,
  });
  return target;
});
