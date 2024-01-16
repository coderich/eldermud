const { Action } = require('@coderich/gameflow');

Action.define('help', [
  async ({ target }, { actor, abort }) => {
    if (!target) abort('Unable to find any help for that.');
  },
  ({ target }, { actor }) => {
    switch (target.type) {
      case 'class': {
        actor.send('text', APP.styleText('highlight', target.name));
        actor.send('text', `${target.description}`);
        actor.send('text', APP.styleText('stat', 'Skills:'), APP.styleText('keyword', target.skills.join(', ')));
        actor.send('text', APP.styleText('stat', 'Traits:'), APP.styleText('keyword', target.traits.join(', ')));
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
