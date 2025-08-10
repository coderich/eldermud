const { Action } = require('@coderich/gameflow');

Action.define('set', [
  async ({ args }, { actor, abort }) => {
    const key = args[0].toLowerCase();
    const val = args[1].toLowerCase();
    const vals = ['on', 'off', 'true', 'false'];
    const value = ['on', 'true'].includes(val);

    if (!vals.includes(val)) return abort(`You must specify one of ${vals}`);

    switch (key) {
      case 'warn': {
        return Promise.all([
          actor.save({ [key]: value }),
          actor.send('text', 'You set', APP.styleText('keyword', key), 'to', APP.styleText('highlight', value)),
        ]);
      }
      default: {
        return abort(`Cannot set invalid key: "${key}"`);
      }
    }
  },
]);
