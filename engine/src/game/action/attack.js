const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

/**
 * Perform a basic attack with whatever weapon is in hand
 */
Action.define('attack', [
  ({ target }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    actor.socket.emit('text', `**combat engaged with ${target.name}**`);
    return Util.timeout(1000);
  },

  ({ target }, { actor, promise }) => {
    const swing = new Action('', async (_, context) => {
      const dmg = APP.roll('1d3+1');
      await REDIS.decrBy(`${actor}.hp`, dmg);
      target.socket.emit('text', `${actor.name} does ${dmg} to you!`);
      actor.perform('hud');
      await Util.timeout(5000);
      if (!promise.aborted && !context.promise.aborted) actor.stream('attack', swing);
    });

    return actor.stream('attack', swing);
  },
]);
