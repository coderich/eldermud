const objectives = CONFIG.get('objective');

SYSTEM.on('pre:execute', async ({ actor, abort, data }) => {
  const [cmd] = data.input.match(/\S+/g) || [];

  if (cmd && actor.type === 'player') {
    await Promise.all(Object.entries(objectives).map(async ([key, objective]) => {
      const { when } = objective;
      const $data = { ...data, target: when.target };

      // Conditional check
      if (when.cmd && cmd.toLowerCase() !== when.cmd) return;
      if (when.room && `${actor.room}` !== `${when.room}`) return;
      if (when.target && !(await actor.perform('target', $data) && $data.target)) return;
      if (when.targetCheck && !Object.entries(when.targetCheck).every(([k, v]) => $data.target[k] === v)) return;

      // Abort current action
      abort();

      // Perform alternative action
      actor.perform('act', {
        target: $data.target,
        act: {
          toString: () => key,
          ...objective.act,
        },
      });
    }));
  }
});
