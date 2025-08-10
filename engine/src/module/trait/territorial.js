const { Action, Loop } = require('@coderich/gameflow');

Action.define('territorial', new Loop([
  async (_, { actor }) => {
    const room = CONFIG.get(await actor.get('room'));
    const target = APP.randomElement(Array.from(room.units.values()).filter(unit => unit.id !== actor.id));
    if (target) await actor.stream('action', 'attack', { target });
    await actor.stream('trait', 'alert');
  },
]));
