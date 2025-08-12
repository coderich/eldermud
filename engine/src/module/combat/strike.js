const { Action } = require('@coderich/gameflow');

Action.define('strike', [
  // Strike (swings)
  async ({ strike, target }, { actor, abort }) => {
    const swings = Array.from(new Array(strike.swings || 1));
    const recoil = strike.recoil || 2000;
    const toHit = 30;

    // Strike(s)
    await APP.promiseChain(swings.map(swing => async () => {
      const roll = await actor.perform('roll', { strike, target });

      if (roll.hitroll <= toHit) {
        await actor.perform('miss', { strike, target });
      } else if (roll.hitroll - roll.dodgeroll <= toHit) {
        await actor.perform('miss', { strike, target, dodge: true });
      } else if (roll.dmgroll) {
        const crit = roll.roll + roll.critroll > 97;
        const dmg = crit ? Math.ceil(roll.dmgroll * 1.65) : roll.dmgroll;
        await actor.perform('hit', { strike, target, dmg, crit });
      } else {
        await actor.perform('hit', { strike, target, glance: true });
      }
    }));

    // Recoil
    await actor.stream(actor.mandatoryStream, new Action('recoil', () => APP.timeout(recoil)));
  },
]);
