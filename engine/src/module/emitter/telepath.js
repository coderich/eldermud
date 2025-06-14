const { Action } = require('@coderich/gameflow');

Action.define('telepath', [
  async ({ target, rest }, { actor, abort }) => {
    if (!target) return abort('Cannot find user!');
    actor.send('text', `--- Telepath Sent to ${target.name} ---`);
    return target.send('text', `${actor.name} telepaths: ${rest.join(' ')}`);
  },
]);
