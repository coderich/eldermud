const { Action } = require('@coderich/gameflow');

Action.define('tnl', [
  async (_, { actor }) => {
    const { exp, lvl } = await actor.mGet(['exp', 'lvl']);
    const tnl = APP.tnl(lvl);
    const pct = Math.floor((exp / tnl) * 100);
    await actor.writeln('To next level:', APP.styleText('exp', `${exp}/${tnl}`), APP.styleText('keyword', `(${pct}%)`));
  },
]);
