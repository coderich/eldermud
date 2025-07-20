const { Action } = require('@coderich/gameflow');

Action.define('strike', [
  ({ target }, { actor, promise }) => {
    const { $target } = actor;
    actor.$target = target;
    promise.finally(() => {
      if (!$target) delete actor.$target;
    });
  },
  async (data, { actor, abort }) => {
    const { target } = data;
    const attack = typeof data.attack === 'function' ? data.attack() : data.attack;
    const swings = Array.from(new Array(attack.swings || 1));
    const recoil = attack.recoil || 2000;
    const toHit = 30;

    // Strike(s)
    await APP.promiseChain(swings.map(swing => async () => {
      const roll = await actor.perform('roll', { attack, target });

      if (roll.hitroll <= toHit) {
        await actor.perform('miss', { attack, target });
      } else if (roll.hitroll - roll.dodgeroll <= toHit) {
        await actor.perform('miss', { attack, target, dodge: true });
      } else if (roll.dmgroll) {
        const crit = roll.roll + roll.critroll > 95;
        const dmg = crit ? Math.ceil(roll.dmgroll * 2) : roll.dmgroll;
        await actor.perform('hit', { attack, target, dmg, crit });
      } else {
        await actor.perform('miss', { attack, target, glance: true });
      }
    }));

    // Recoil
    await APP.timeout(recoil);
  },
]);
