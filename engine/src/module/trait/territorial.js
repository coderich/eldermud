const { Action, Loop } = require('@coderich/gameflow');

Action.define('territorial', new Loop([
  async (_, { actor }) => {
    const room = CONFIG.get(await actor.get('room'));
    const idleResolvers = Promise.withResolvers();
    const combatResolvers = Promise.withResolvers();
    const abort = () => { idleResolvers.resolve(); combatResolvers.resolve(); };

    actor.on('post:move', abort);
    actor.on('post:engage', abort);
    actor.on('abort:engage', abort);
    SYSTEM.on(`enter:${room}`, idleResolvers.resolve);

    actor.streams.action.on('abort', combatResolvers.resolve);
    const target = APP.randomElement(Array.from(room.units.values()).filter(unit => unit.id !== actor.id));
    if (target) actor.stream('action', 'attack', { target });
    await (target ? combatResolvers.promise : idleResolvers.promise);

    actor.on('post:move', abort);
    actor.on('post:engage', abort);
    actor.on('abort:engage', abort);
    SYSTEM.on(`enter:${room}`, idleResolvers.resolve);
  },
]));
