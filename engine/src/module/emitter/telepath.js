const { Action } = require('@coderich/gameflow');

Action.define('telepath', [
  async ({ target, rest }, { actor, abort }) => {
    if (!target) return abort('Cannot find user!');
    const label = APP.styleText('keyword', `${actor.name} telepaths:`);
    const text = rest.join(' ');
    actor.send('text', `--- Telepath sent to ${target.name} ---`);
    return target.send('text', `${label} ${text}`);
  },
]);
