const { Action, Actor } = require('@coderich/gameflow');

Action.define('gossip', [
  async ({ args }, { actor }) => {
    Object.values(Actor).forEach(act => act.send('gos', APP.styleText(actor.type, `${actor.name}:`), args.join(' ')));
  },
]);

Action.define('auction', [
  async ({ args }, { actor }) => {
    Object.values(Actor).forEach(act => act.send('auc', APP.styleText(actor.type, `${actor.name}:`), args.join(' ')));
  },
]);

Action.define('telepath', [
  async ({ target, rest }, { actor, abort }) => {
    if (!target) return abort('Cannot find player!');
    const label = APP.styleText(actor.type, `${actor.name} telepaths:`);
    const text = rest.join(' ');
    actor.send('text', `--- Telepath sent to ${target.name} ---`);
    return target.send('text', `${label} ${text}`);
  },
]);
