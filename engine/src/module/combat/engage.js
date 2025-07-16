const { Action, Loop } = require('@coderich/gameflow');

/**
 * This takes into account the time it takes to move into position for an attack
 */
Action.define('engage', [
  async ({ target, attack }, { actor, stream, abort, promise }) => {
    if (!target) abort('You dont see that here!');
    actor.$target = target;
    const $abort = () => abort();

    promise.onAbort(() => {
      delete actor.$target;
      delete actor.$engaged;
      target.offFunction($abort);
      stream.offFunction($abort);
      target.$killers.delete(actor);
    });

    stream.once('add', $abort);
    target.once('post:move', $abort);
    target.once('start:death', $abort); // They may die before we get to duel
    if (stream.length()) abort();
  },

  // Engage with the target
  async ({ target, attack }, { actor }) => {
    const info = await actor.mGet('room', 'engageSpeed');
    const room = CONFIG.get(info.room);
    actor.send('text', APP.styleText('engaged', `*combat engaged (${target.name})*`));
    target.send('text', APP.styleText(actor.type, actor.name), 'moves to attack', `${APP.styleText('highlight', 'you')}!`);
    Array.from(room.units.values()).filter(unit => unit !== actor && unit !== target).forEach(unit => unit.send('text', APP.styleText(actor.type, actor.name), 'moves to attack', `${APP.styleText(target.type, target.name)}!`));
    await APP.timeout(info.engageSpeed);
    actor.$engaged = true;
    target.$killers.add(actor);
  },

  // Duel
  new Loop([
    // Prepare attack
    (data, { attack }) => {
      attack = typeof data.attack === 'function' ? data.attack() : data.attack;
      return APP.timeout(attack.speed);
    },

    // Attack
    async (data, { actor, stream, abort }) => {
      const { target } = data;
      const stats = ['str', 'dex', 'int', 'wis', 'con', 'cha', 'ac', 'acc', 'dr', 'crits', 'dodge'];
      const attack = typeof data.attack === 'function' ? data.attack() : data.attack;
      const actorStats = await actor.mGet(stats);
      const targetStats = await target.mGet(stats);
      const swings = Array.from(new Array(attack.swings || 1));
      const recoil = attack.recoil || 2000;

      if (actor.$target) {
        // Swing(s)
        await APP.promiseChain(swings.map(swing => async () => {
          // Resource cost check
          if (attack.cost) {
            const resources = await actor.mGet(Object.keys(attack.cost));
            const cost = Object.entries(attack.cost).reduce((prev, [key, value]) => Object.assign(prev, { [key]: APP.roll(value) }), {});
            if (Object.entries(cost).some(([key, value]) => resources[key] + value < 0)) abort('Insufficient resources');
            await actor.perform('affect', cost);
          }

          // To hit roll
          const toHit = 30;
          const roll = APP.roll('1d100');
          const cover = Math.max(0, (target.$partyRank - attack.range) * 2);
          const hitroll = (roll + actorStats.acc + APP.roll(attack.acc) - cover - targetStats.ac);

          // Damage roll
          const bonus = Math.floor(Object.entries(attack.scale).reduce((prev, [k, v]) => prev + actorStats[k] * APP.roll(v), 0));
          const dmgroll = Math.max(APP.roll(attack.dmg) + bonus - targetStats.dr, 0);

          // Aux rolls
          const critroll = APP.roll(`1d${actorStats.crits + APP.roll(attack.crits)}`);
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
            const dmg = crit ? Math.ceil(dmgroll * 2) : dmgroll;
            await actor.perform('hit', { attack, target, dmg, crit });
          } else {
            await actor.perform('miss', { attack, target, glance: true });
          }
        }));

        // Recoil
        await APP.timeout(recoil);
      }
    },
  ]),
]);
