const { Action, Loop } = require('@coderich/gameflow');

/**
 * This takes into account the time it takes to move into position for an attack
 */
Action.define('engage', [
  async ({ target, attack }, { actor, abort }) => {
    if (!target) abort('You dont see that here!');
    actor.$target = target;
  },

  // Engage with the target
  async ({ target, attack }, { actor, stream, abort, promise }) => {
    const disengage = ({ result }) => {
      delete actor.$target;
      delete actor.$engaged;
      target.$killers.delete(actor);
      abort();
    };

    stream.once('add', disengage);
    actor.once('post:move', disengage);
    actor.once('post:break', disengage);
    target.once('post:move', disengage);
    target.once('post:death', disengage); // They may die before we get to duel

    const room = CONFIG.get(await actor.get('room'));
    actor.send('text', APP.styleText('engaged', `*combat engaged (${target.name})*`));
    target.send('text', APP.styleText(actor.type, actor.name), 'moves to attack', `${APP.styleText('highlight', 'you')}!`);
    Array.from(room.units.values()).filter(unit => unit !== actor && unit !== target).forEach(unit => unit.send('text', APP.styleText(actor.type, actor.name), 'moves to attack', `${APP.styleText(target.type, target.name)}!`));

    await APP.timeout(2000);
    actor.$engaged = true;
    target.$killers.add(actor);
  },

  // Duel
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

  // ({ target, attack }, { actor, stream }) => {
  //   actor.stream(stream, 'duel', { target, attack });
  // },
]);
