const { Action } = require('@coderich/gameflow');

Action.define('miss', async ({ attack, target, crit }, { actor }) => {
  const room = CONFIG.get(await actor.get('room'));
  const miss = APP.randomElement(attack.misses);
  const misses = APP.pluralize(miss);
  const adverb = crit ? 'critically' : '';
  const verb = [adverb, miss].filter(Boolean).join(' ');
  const verbs = [adverb, misses].filter(Boolean).join(' ');
  const source = actor.type === 'creature' ? `The ${actor.name}` : actor.name;

  actor.send('text', APP.styleText('youMiss', `You ${verb} at ${target.name} with your ${attack.name.toLowerCase()}!`));
  target.send('text', APP.styleText('missYou', `${source} ${verbs} at you with their ${attack.name.toLowerCase()}!`));
  Array.from(room.units.values()).filter(el => ![actor, target].includes(el)).forEach(el => el.send('text', APP.styleText('miss', `${source} ${verbs} at ${target.name}!`)));
});
