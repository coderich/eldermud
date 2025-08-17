const { Action } = require('@coderich/gameflow');

/**
 * Utility that allows other traits to "wait" until something of interest happens
 */
Action.define('alert', [
  async (_, { actor }) => {
    const room = CONFIG.get(await actor.get('room'));
    const idleResolvers = Promise.withResolvers();
    const combatResolvers = Promise.withResolvers();

    actor.once('post:move', idleResolvers.resolve);
    actor.once('post:engage', combatResolvers.resolve);
    actor.once('abort:engage', combatResolvers.resolve);
    actor.once('abort:attack', combatResolvers.resolve);
    SYSTEM.once(`enter:${room}`, idleResolvers.resolve);
    SYSTEM.once(`attack:${actor}`, idleResolvers.resolve);
    // actor.streams.action.once('abort', combatResolvers.resolve);

    await (actor.$target ? combatResolvers.promise : idleResolvers.promise);

    actor.offFunction(idleResolvers.resolve, combatResolvers.resolve);
    SYSTEM.off(`enter:${room}`, idleResolvers.resolve);
    SYSTEM.off(`attack:${actor}`, idleResolvers.resolve);
    // actor.streams.action.off('abort', combatResolvers.resolve);
  },
]);
