const { Action } = require('@coderich/gameflow');

Action.define('hit', async ({ strike, target, dmg, crit, glance }, { actor }) => {
  const room = CONFIG.get(await actor.get('room'));
  const hit = APP.randomElement(strike.hits);
  const hits = APP.pluralize(hit);
  const adverb = crit ? 'critically' : '';
  const result = glance ? "- but it's a glancing blow!" : `for ${dmg} damage!`;
  const verb = [adverb, hit].filter(Boolean).join(' ');
  const verbs = [adverb, hits].filter(Boolean).join(' ');
  const source = actor.type === 'creature' ? `The ${actor.name}` : actor.name;

  actor.writeln(APP.styleText('youHit', `You ${verb} ${target.name} ${result}`));
  target.writeln(APP.styleText('hitYou', `${source} ${verbs} you ${result}`));
  Array.from(room.units.values()).filter(el => ![actor, target].includes(el)).forEach(el => el.writeln(APP.styleText('muted', `${source} ${verbs} ${target.name} ${result}`)));

  if (dmg) {
    const { hp } = await target.stream('spatial', 'affect', { hp: -dmg });
    if (hp <= 0) await target.perform('fallen');
  }
});
