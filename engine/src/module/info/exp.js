const { Action } = require('@coderich/gameflow');

Action.define('exp', [
  async (_, { actor }) => {
    const info = await actor.mGet(['exp', 'lvl']);
    const tnl = APP.tnl(info.lvl);
    const pct = Math.floor((info.exp / tnl) * 100);
    return actor.send('text', 'To next level:', APP.styleText('exp', `^${tnl}`), APP.styleText('keyword', `(${pct}%)`));
  },
]);
