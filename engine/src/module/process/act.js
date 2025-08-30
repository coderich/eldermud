const { Action, Loop } = require('@coderich/gameflow');

Action.define('act', [
  // Actor preparations...
  async ({ act, target }, { actor }) => {
    if (act.message) await actor.interpolate(act.message, { actor, target }, { style: act.style });
    return APP.timeout(act.speed);
  },

  // Resource check
  async ({ act }, { actor, abort }) => {
    if (actor.$countdowns.has(`${act}`)) {
      abort(`${act.name} is on cooldown!`);
    } else if (act.affect) {
      const info = await actor.mGet(Object.keys(act.affect));
      if (Object.entries(act.affect).some(([key, value]) => ((info[key] += value) < 0))) abort('Insufficient resources!');
      else await actor.perform('affect', act.affect);
    }
  },

  // Perform actions
  async ({ act }, context) => {
    if (act.cooldown) context.actor.stream('effect', 'countdown', { key: `${act}`, value: act.cooldown });

    return new Loop(async (data, { actor, abort }) => {
      const pipe = act.pipeline[data.index]; if (!pipe) return abort();

      // If no target abort
      const source = `${act}:${data.index++}`;
      const targetData = { target: pipe.target };
      await actor.perform('target', targetData, { $abort: abort });

      return Promise.all([targetData.target].flat().filter(Boolean).map(async (target) => {
        if (pipe.action !== 'effect') await actor.perform(pipe.action, { ...pipe, target }).onAbort(abort);
        else target.perform('effect', { ...pipe, source, actor: `${actor}`, target: `${target}` }).onAbort(abort);
      }));
    })({ index: 0 }, context);

    // return actor.perform(new Action(null, act.pipeline.map((pipe, index) => {
    //   return [
    //     async (_, { abort }) => {
    //       const data = { target: pipe.target };
    //       const stream = pipe.stream || 'effect';
    //       await actor.perform('target', data, { $abort: abort });
    //       return { target: data.target, stream };
    //     },
    //     (data, { abort }) => {
    //       return Promise.all([data.target].flat().filter(Boolean).map((target) => {
    //         const source = `${act}:${index}`;
    //         if (pipe.action !== 'effect') return actor.perform(pipe.action, { ...pipe, target }).onAbort(abort);
    //         return target.perform('effect', { ...pipe, source, actor: `${actor}`, target: `${target}` }).onAbort(abort);
    //       }));
    //     },
    //   ];
    // }).flat()));

    // return APP.promiseChain(act.pipeline.map((pipe, index) => async () => {
    //   const data = { target: pipe.target };
    //   // const stream = pipe.stream || 'effect';
    //   await actor.perform('target', data, { $abort: abort });

    //   // Loop over target(s)
    //   return Promise.all([data.target].flat().filter(Boolean).map((target) => {
    //     const source = `${act}:${index}`;
    //     if (pipe.action !== 'effect') return actor.perform(pipe.action, { ...pipe, target }).onAbort(abort);
    //     return target.perform('effect', { ...pipe, source, actor: `${actor}`, target: `${target}` }).onAbort(abort);
    //   }));
    // }));
  },
]);
