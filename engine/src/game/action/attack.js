const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

/**
 * Perform a basic attack with whatever weapon is in hand
 */
Action.define('attack', [
  async ({ target }, { actor, abort }) => {
    const disengage = () => abort('*combat off*', true);
    if (!target) return abort('You dont see that here!', true);

    // Engage in combat...
    actor.socket.emit('text', `*combat engaged (${target.name})*`);
    if (actor.streams.action.length() > 0) return disengage();
    actor.streams.action.once('add', disengage);

    // (re) engaging takes time;
    await Util.timeout(1000);

    // You can no longer forcefully disengage
    actor.streams.action.off('add', disengage);
    return undefined;
  },
  ({ target }, { actor, abort, promise }) => {
    let force = false;
    const disengage = () => abort('*combat off*', force);
    actor.streams.action.once('add', () => disengage());

    const swing = async () => {
      force = true;
      await Util.timeout(2000);
      force = false;

      if (!promise.aborted) {
        const dmg = APP.roll('1d3+1');
        await actor.perform('damage', { target, dmg });
        await Util.timeout(2000);
        actor.socket.emit('text', 'attack timeout over');
      }

      return promise.aborted ? null : swing();
    };

    return promise.aborted ? null : swing();
  },
]);
