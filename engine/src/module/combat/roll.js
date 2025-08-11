const { Action } = require('@coderich/gameflow');

Action.define('roll', [
  async ({ attack, target }, { actor }) => {
    const stats = ['str', 'dex', 'int', 'wis', 'con', 'cha', 'ac', 'acc', 'dr', 'mr', 'dmg', 'crits', 'dodge'];
    const actorStats = await actor.mGet(stats);
    const targetStats = await target.mGet(stats);

    // To hit roll
    const roll = APP.roll('10d10');
    const cover = Math.max(0, (target.$partyRank - attack.range) * 2);
    const hitroll = (roll + actorStats.acc + APP.roll(attack.acc) - cover - targetStats.ac);

    // Damage roll
    const bonus = Math.floor(Object.entries(attack.scale || {}).reduce((prev, [k, v]) => prev + actorStats[k] * APP.roll(v), 0));
    const dmgroll = Math.max(APP.roll(attack.dmg) + actorStats.dmg + bonus - targetStats.dr, 0);

    // Aux rolls
    const critroll = APP.roll(`1d${actorStats.crits + APP.roll(attack.crits)}`);
    const dodgeroll = APP.roll(`1d${targetStats.dodge}`); // default

    // // This must be based on stance
    // const parryroll = APP.roll(`1d${target.parry}`);
    // const riposteroll = APP.roll(`1d${target.riposte}`);

    return { roll, hitroll, dmgroll, critroll, dodgeroll };
  },
]);
