const { Action } = require('@coderich/gameflow');

Action.define('hit', async (data, { actor }) => {
  const { attack, target, dmg, crit } = data;
  const room = CONFIG.get(await actor.get('room'));
  const hit = APP.randomElement(attack.hits);
  const hits = APP.pluralize(hit);
  const adverb = crit ? 'critically' : '';
  const verb = [adverb, hit].filter(Boolean).join(' ');
  const verbs = [adverb, hits].filter(Boolean).join(' ');
  const source = actor.type === 'creature' ? `The ${actor.name}` : actor.name;

  actor.send('text', APP.styleText('youHit', `You ${verb} ${target.name} for ${dmg} damage!`));
  target.send('text', APP.styleText('hitYou', `${source} ${verbs} you for ${dmg} damage!`));
  Array.from(room.units.values()).filter(el => ![actor, target].includes(el)).forEach(el => el.send('text', APP.styleText('hit', `${source} ${verbs} ${target.name} for ${dmg} damage!`)));
  await target.stream('spatial', 'affect', { hp: -dmg });
});
