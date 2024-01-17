const { Action, Loop } = require('@coderich/gameflow');

Action.define('duel', [
  // Setup
  (data, { actor, stream, abort }) => {
    stream.once('add', () => abort());
    data.target.once('post:death', () => abort());

    actor.once('abort:duel', () => {
      actor.send('text', APP.styleText('engaged', '*combat off*'));
      APP.timeout(100).then(() => data.target.$killers.delete(actor));
    });

    // Normalize dynamic mods
    data.mods = { ac: 0, dr: 0, acc: 0, dmg: 0, crit: 0, dodge: 0, ...data.mods || {} };
    data.attack = { acc: 0, crit: 0, ...data.attack };
  },

  new Loop([
    // Prepare attack
    () => APP.timeout(2000),

    // Attack
    async (data, { actor, stream }) => {
      const { attack, target, mods } = data;

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
      const hitroll = (roll + mods.acc - mods.ac);

      if (hitroll <= toHit) {
        actor.perform('miss', { attack, target });
      } else if (hitroll - mods.dodge <= toHit) {
        actor.perform('miss', { attack, target, dodge: true });
      } else {
        data.crit = roll + mods.crit > 95;
        data.dmg = APP.roll(attack.dmg) + mods.dmg - mods.dr;
        if (data.crit) data.dmg = Math.ceil(data.dmg * 1.5);
        actor.perform('hit', data);
      }

      await APP.timeout(2000);
      stream.resume();
    },
  ]),
]);
