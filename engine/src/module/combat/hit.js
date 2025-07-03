const { Action } = require('@coderich/gameflow');

Action.define('hit', async ({ attack, target, dmg, crit }, { actor }) => {
  const room = CONFIG.get(await actor.get('room'));
  const hit = APP.randomElement(attack.hits);
  const hits = APP.pluralize(hit);
  const adverb = crit ? 'critically' : '';
  const verb = [adverb, hit].filter(Boolean).join(' ');
  const verbs = [adverb, hits].filter(Boolean).join(' ');
  const source = actor.type === 'creature' ? `The ${actor.name}` : actor.name;

  actor.send('text', APP.styleText('youHit', `You ${verb} ${target.name} with your ${attack.name.toLowerCase()} for ${dmg} damage!`));
  target.send('text', APP.styleText('hitYou', `${source} ${verbs} you with their ${attack.name.toLowerCase()} for ${dmg} damage!`));
  Array.from(room.units.values()).filter(el => ![actor, target].includes(el)).forEach(el => el.send('text', APP.styleText('hit', `${source} ${verbs} ${target.name} for ${dmg} damage!`)));
  await target.perform('affect', { hp: -dmg });
});
