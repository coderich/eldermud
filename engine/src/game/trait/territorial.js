const { Action } = require('@coderich/gameflow');

Action.define('territorial', [
  (_, { actor }) => {
    const attack = ({ actor: target }) => {
      if (target.type === 'player') {
        target.once('post:move', () => actor.perform('break'));
        actor.stream('action', 'attack', { target });
      }
    };

    const target = Array.from(CONFIG.get(`${actor.room}`).units.values()).find(unit => unit.type === 'player');
    if (target) attack({ actor: target });
    SYSTEM.on(`enter:${actor.room}`, attack);
    actor.once('pre:death', () => SYSTEM.off(`enter:${actor.room}`, attack));
  },
]);
