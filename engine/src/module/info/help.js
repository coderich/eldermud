const { ucFirst } = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('help', [
  async ({ target }, { actor, abort }) => {
    if (!target) abort('Unable to find any help for that.');
  },
  async ({ target }, { actor }) => {
    switch (target.type) {
      case 'help': {
        await actor.send('text', '\nType', APP.styleText('highlight', '? <topic>'), 'for specific help on that topic; for example:\n');
        return actor.send('text', APP.styleBlockText('reset', [
          { text: '"?"', style: 'highlight' },
          { text: 'tips', style: 'highlight' },
          { text: 'commands', style: 'highlight' },
          { text: 'combat', style: 'highlight' },
        ], APP.table([
          ['? tips', '-', 'A few tips to help you get started'],
          ['? commands', '-', 'A list of commands available within the game'],
          ['? combat', '-', 'Everything you need to know about combat mechanics'],
        ], { sep: '' })));
      }
      case 'race': case 'class': {
        const { name, str, dex, int, wis, con, cha, gains, description, talents, traits, weapon, armor } = target;
        const stats = Object.entries({ str, dex, int, wis, con, cha }).map(([key, value]) => APP.styleText('stat', `${ucFirst(key)}:`).concat(' ', APP.styleText('keyword', value), APP.styleText('muted', gains[key] ? `+${gains[key]}` : '')));

        return Promise.all([
          actor.send('text', APP.styleText('highlight', name)),
          actor.send('text', description),
          actor.send('text', APP.table([
            ['Stats:', stats.join(' | ').concat(APP.styleText('muted', ' (+ is per-level gain)'))],
            weapon && armor && ['Equip:', APP.styleText('keyword', weapon.name, '+', armor.name)],
            ['Traits:', APP.styleText('keyword', ...traits.map(el => el.name).join(', '))],
            ['Talents:', APP.styleText('keyword', ...talents.map(el => el.name).join(', '))],
          ], { sep: '' })),
        ]);
      }
      default: {
        return Promise.all([
          actor.send('text', APP.styleText('highlight', target.name)),
          actor.send('text', `${target.description}`),
        ]);
      }
    }
  },
]);
