const commands = [
  [
    { attack: { args: [0, 1], code: 'a', scope: 'interaction' } },
    { down: { args: [0], code: 'd', scope: 'navigation' } },
    { east: { args: [0], code: 'e', scope: 'navigation' } },
    { get: { args: [1, 2, 3, 4, 5], code: 'get', scope: 'interaction' } },
    { inventory: { args: [0], code: 'i', scope: '' } },
    { look: { args: [0, 1], code: 'l', scope: 'interaction' } },
    { north: { args: [0], code: 'n', scope: 'navigation' } },
    { south: { args: [0], code: 's', scope: 'navigation' } },
    { up: { args: [0], code: 'u', scope: 'navigation' } },
    { west: { args: [0], code: 'w', scope: 'navigation' } },
    { x: { args: [0], code: 'x', alias: 'exit', scope: '' } },
  ],
  [
    { ne: { args: [0], code: 'ne', alias: 'northeast', scope: 'navigation' } },
    { nw: { args: [0], code: 'nw', alias: 'northwest', scope: 'navigation' } },
    { se: { args: [0], code: 'se', alias: 'southeast', scope: 'navigation' } },
    { sw: { args: [0], code: 'sw', alias: 'southwest', scope: 'navigation' } },
    { open: { args: [1], code: 'open', scope: 'interaction' } },
    { close: { args: [1], code: 'close', scope: 'interaction' } },
    { drop: { args: [1, 2, 3, 4, 5], code: 'drop', scope: 'interaction' } },
    { repeat: { args: [0], code: 're', scope: '' } },
    { exit: { args: [0], code: 'x', scope: '' } },
  ],
  [
    { use: { args: [1, 2, 3, 4, 5], code: 'use', scope: 'interaction' } },
    { search: { args: [0], code: 'search', scope: 'interaction' } },
  ],
  [
    { push: { args: [1, 2, 3, 4, 5], code: 'push', scope: 'interaction' } },
    { lock: { args: [1], code: 'lock', scope: 'interaction' } },
  ],
];

const translateArray = (arr, cmd, args) => {
  for (let i = 0; i < cmd.length; i++) {
    const tier = arr[i];

    if (tier) {
      for (let j = 0; j < tier.length; j++) {
        const [[key, data]] = Object.entries(tier[j]);

        if (key.indexOf(cmd) === 0 && data.args.indexOf(args.length) > -1) {
          return {
            name: data.alias || key,
            args,
            scope: data.scope,
            code: data.code,
          };
        }
      }
    }
  }

  return undefined;
};

export const translate = (input) => {
  const [cmd, ...args] = input.match(/\S+/g) || [];
  if (!cmd) return { name: 'none', input, args, code: null, scope: 'default' };

  return (
    translateArray(commands, cmd, args)
    || { name: 'unknown', input, args, code: 'unk', scope: 'unknown' }
  );
};

export const stfu = {};
