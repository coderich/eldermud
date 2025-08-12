const { Action } = require('@coderich/gameflow');

Action.define('miss', async ({ strike, target, crit, dodge }, { actor }) => {
  const room = CONFIG.get(await actor.get('room'));
  const miss = APP.randomElement(strike.misses);
  const misses = APP.pluralize(miss);
  const adverb = crit ? 'critically' : '';
  const result = dodge ? " - but it's dodged!" : '!';
  const verb = [adverb, miss].filter(Boolean).join(' ');
  const verbs = [adverb, misses].filter(Boolean).join(' ');
  const source = actor.type === 'creature' ? `The ${actor.name}` : actor.name;

  actor.send('text', APP.styleText('youMiss', `You ${verb} at ${target.name}${result}`));
  target.send('text', APP.styleText('missYou', `${source} ${verbs} at you${result}`));
  Array.from(room.units.values()).filter(el => ![actor, target].includes(el)).forEach(el => el.send('text', APP.styleText('muted', `${source} ${verbs} at ${target.name}${result}`)));
});
