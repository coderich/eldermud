const { Action, Loop } = require('@coderich/gameflow');

Action.define('wary', [
  (_, { actor, promise }) => {
    const foes = new Set();
    const addFoe = event => foes.add(event.actor);
    SYSTEM.on(`attack:${actor}`, addFoe);
    promise.finally(() => SYSTEM.off(`attack:${actor}`, addFoe));
    return foes;
  },
  new Loop(async (foes, { actor }) => {
    const room = CONFIG.get(await actor.get('room'));
    const target = APP.randomElement(Array.from(room.units.values()).filter(unit => foes.has(unit)));
    if (target) await actor.stream('action', 'attack', { target });
    await actor.stream('trait', 'alert');
  }),
]);
