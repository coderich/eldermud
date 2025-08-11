const { Action } = require('@coderich/gameflow');

Action.define('hit', async (data, { actor }) => {
  const { attack, target, dmg, crit, glance } = data;
  const room = CONFIG.get(await actor.get('room'));
  const hit = APP.randomElement(attack.hits);
  const hits = APP.pluralize(hit);
  const adverb = crit ? 'critically' : '';
  const result = glance ? "- but it's a glancing blow!" : `for ${dmg} damage!`;
  const verb = [adverb, hit].filter(Boolean).join(' ');
  const verbs = [adverb, hits].filter(Boolean).join(' ');
  const source = actor.type === 'creature' ? `The ${actor.name}` : actor.name;

  actor.send('text', APP.styleText('youHit', `You ${verb} ${target.name} ${result}`));
  target.send('text', APP.styleText('hitYou', `${source} ${verbs} you ${result}`));
  Array.from(room.units.values()).filter(el => ![actor, target].includes(el)).forEach(el => el.send('text', APP.styleText('muted', `${source} ${verbs} ${target.name} ${result}`)));
  if (dmg) await target.stream('spatial', 'affect', { hp: -dmg });
});
