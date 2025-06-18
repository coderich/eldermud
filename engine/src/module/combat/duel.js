const { Action, Loop } = require('@coderich/gameflow');

Action.define('duel', [
  // Setup
  (data, { actor, stream, abort, promise }) => {
    stream.once('add', () => abort());
    data.target.once('post:move', () => setImmediate(() => abort()));
    data.target.once('post:death', () => setImmediate(() => abort()));
    promise.onAbort(() => {
      APP.timeout(100).then(() => data.target.$killers.delete(actor));
    });
  },

  new Loop([
    // Prepare attack
    () => APP.timeout(2000),

    // Attack
    async (data, { actor, stream, promise }) => {
      const { target } = data;
      const stats = ['ac', 'acc', 'dr', 'crits', 'dodge'];
      const attack = typeof data.attack === 'function' ? data.attack() : data.attack;
      const actorStats = await actor.mGet(stats);
      const targetStats = await target.mGet(stats);

      // Resource check
      if (attack.cost) {
        const resources = await actor.mGet(Object.keys(attack.cost));
        if (Object.entries(attack.cost).some(([key, value]) => resources[key] + value < 0)) {
          actor.send('text', 'Insufficient resources!');
          return;
        }
        await actor.perform('affect', attack.cost);
      }

      stream.pause();
      const toHit = 30;
      const roll = APP.roll('1d100');
      const hitroll = (roll + actorStats.acc + attack.acc - targetStats.ac);
      const dmgroll = Math.max(APP.roll(attack.dmg) - targetStats.dr, 0);
      const critroll = APP.roll(`1d${actorStats.crits + attack.crits}`);
      const dodgeroll = APP.roll(`1d${targetStats.dodge}`); // default

      // // This must be based on posture
      // const parryroll = APP.roll(`1d${target.parry}`);
      // const riposteroll = APP.roll(`1d${target.riposte}`);

      if (hitroll <= toHit) {
        await actor.perform('miss', { attack, target });
      } else if (hitroll - dodgeroll <= toHit) {
        await actor.perform('miss', { attack, target, dodge: true });
      } else if (dmgroll) {
        const crit = roll + critroll > 95;
        const dmg = crit ? Math.ceil(dmgroll * 1.5) : dmgroll;
        await actor.perform('hit', { attack, target, dmg, crit });
      } else {
        await actor.perform('miss', { attack, target, glance: true });
      }

      await APP.timeout(2000);
      stream.resume();
    },
  ]),
]);
