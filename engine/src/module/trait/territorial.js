const { Action, Loop } = require('@coderich/gameflow');

Action.define('territorial', new Loop([
  async (_, { actor }) => {
    const room = CONFIG.get(await actor.get('room'));
    const idleResolvers = Promise.withResolvers();
    const combatResolvers = Promise.withResolvers();
    const abort = () => { idleResolvers.resolve(); combatResolvers.resolve(); };

    actor.once('post:move', abort);
    actor.once('post:engage', abort);
    actor.once('abort:engage', abort);
    actor.once('abort:attack', abort);
    SYSTEM.once(`enter:${room}`, idleResolvers.resolve);
    actor.streams.action.once('abort', combatResolvers.resolve);

    const target = APP.randomElement(Array.from(room.units.values()).filter(unit => unit.id !== actor.id));
    if (target) actor.stream('action', 'attack', { target });
    await (target ? combatResolvers.promise : idleResolvers.promise);

    actor.offFunction(abort);
    SYSTEM.off(`enter:${room}`, idleResolvers.resolve);
    actor.streams.action.off('abort', combatResolvers.resolve);
  },
]));
