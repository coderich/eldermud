const { Action, Loop } = require('@coderich/gameflow');

Action.define('swing', [
  // Setup
  (data, { actor, stream, abort }) => {
    stream.once('add', abort);
    data.target.once('post:death', abort);

    actor.once('abort:swing', () => {
      actor.send('text', APP.styleText('engaged', '*combat off*'));
      APP.timeout(10).then(() => data.target.killers.delete(actor));
    });

    // Normalize dynamic mods
    data.mods = { ac: 0, dr: 0, acc: 0, dmg: 0, crit: 0, dodge: 0, ...data.mods || {} };
    data.attack = { acc: 0, crit: 0, ...data.attack };
  },

  new Loop([
    // Prepare swing
    () => APP.timeout(2000),

    // Roll
    async (data, { actor, stream }) => {
      stream.pause();
      const { attack, target, mods } = data;
      const toHit = 30;
      const roll = APP.roll('1d100');
      const hitroll = (roll + actor.acc + mods.acc - target.ac - mods.ac);

      if (hitroll <= toHit) {
        actor.perform('miss', { attack, target });
      } else if (hitroll - mods.dodge <= toHit) {
        actor.perform('miss', { attack, target, dodge: true });
      } else {
        data.crit = roll + mods.crit > 95;
        data.dmg = APP.roll(attack.dmg) + mods.dmg - target.dr - mods.dr;
        if (data.crit) data.dmg = Math.ceil(data.dmg * 1.5);
        actor.perform('hit', data);
      }

      await APP.timeout(2000);
      stream.resume();
    },
  ]),
]);
