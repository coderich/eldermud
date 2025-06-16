const { ucFirst } = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('help', [
  async ({ target }, { actor, abort }) => {
    if (!target) abort('Unable to find any help for that.');
  },
  ({ target }, { actor }) => {
    switch (target.type) {
      case 'class': {
        const { name, str, dex, int, wis, con, cha, gains, description, talents, traits } = target;
        const stats = Object.entries({ str, dex, int, wis, con, cha }).map(([key, value]) => APP.styleText('stat', `${ucFirst(key)}:`).concat(' ', APP.styleText('keyword', value), APP.styleText('muted', gains[key] ? ` + ${gains[key]}` : '')));
        // const stats = Object.entries({ str, dex, int, wis, con, cha }).reduce((prev, [key, value]) => Object.assign(prev, { [key]: [APP.styleText('stat', `${ucFirst(key)}:`), APP.styleText('keyword', value), APP.styleText('muted', gains[key] ? `+ ${gains[key]} ` : '')] }), {});

        // actor.send('text', APP.styleText('highlight', name));
        // actor.send('text', description);
        // actor.send('text', APP.table([
        //   [...stats.str, ...stats.dex, ...stats.int, ...stats.wis, ...stats.dex, ...stats.con],
        // ], { sep: '' }));

        // actor.send('text', APP.styleText('highlight', name)); // , '{', stats.join(', '), '}');
        // actor.send('text', description);
        // actor.send('text', stats.join(', '));
        actor.send('text', APP.table([
          [APP.styleText('highlight', name)],
          [description],
          [APP.table([
            ['Stats:', ...stats],
            ['Traits:', APP.styleText('keyword', traits.map(el => el.name).join(', '))],
            ['Talents:', APP.styleText('keyword', talents.map(el => el.name).join(', '))],
          ], { sep: '' })],
        ], { sep: '' }));
        break;
      }
      case 'race': {
        const { name, gains, description, talents, traits } = target;
        const stats = Object.entries(gains).map(([key, value]) => APP.styleText('stat', `${ucFirst(key)}:`).concat(' ', APP.styleText('keyword', `+ ${value}`)));
        actor.send('text', APP.table([
          [APP.styleText('highlight', name)],
          [description],
          [APP.table([
            ['Stats:', ...stats],
            ['Traits:', APP.styleText('keyword', traits.map(el => el.name).join(', '))],
            ['Talents:', APP.styleText('keyword', talents.map(el => el.name).join(', '))],
          ], { sep: '' })],
        ], { sep: '' }));
        // actor.send('text', APP.styleText('highlight', name), '{', stats.join(', '), '}');
        // actor.send('text', `${description}`);
        // actor.send('text', APP.styleText('stat', 'Begin with:'), '[', APP.styleText('keyword', talents.concat(traits).map(el => el.name).join(', ')), ']\n');
        break;
      }
      default: {
        actor.send('text', APP.styleText('highlight', target.name));
        actor.send('text', `${target.description}`);
        break;
      }
    }
  },
]);
