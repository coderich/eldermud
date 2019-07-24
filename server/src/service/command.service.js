const commands = [
  [
    { attack: { args: [1, 2, 3], code: 'a', scope: 'interaction', stream: 'motor' } },
    { down: { args: [0], code: 'd', scope: 'navigation', stream: 'motor' } },
    { east: { args: [0], code: 'e', scope: 'navigation', stream: 'motor' } },
    { get: { args: [1, 2, 3, 4, 5], code: 'get', scope: 'interaction', stream: 'motor' } },
    { inventory: { args: [0], code: 'i', scope: '', stream: 'info' } },
    { look: { args: [0, 1], code: 'l', scope: 'interaction', stream: 'info' } },
    { north: { args: [0], code: 'n', scope: 'navigation', stream: 'motor' } },
    { south: { args: [0], code: 's', scope: 'navigation', stream: 'motor' } },
    { up: { args: [0], code: 'u', scope: 'navigation', stream: 'motor' } },
    { west: { args: [0], code: 'w', scope: 'navigation', stream: 'motor' } },
    { x: { args: [0], code: 'x', alias: 'exit', scope: '', stream: 'meta' } },
  ],
  [
    { ne: { args: [0], code: 'ne', alias: 'northeast', scope: 'navigation', stream: 'motor' } },
    { nw: { args: [0], code: 'nw', alias: 'northwest', scope: 'navigation', stream: 'motor' } },
    { se: { args: [0], code: 'se', alias: 'southeast', scope: 'navigation', stream: 'motor' } },
    { sw: { args: [0], code: 'sw', alias: 'southwest', scope: 'navigation', stream: 'motor' } },
    { open: { args: [1], code: 'open', scope: 'interaction', stream: 'motor' } },
    { close: { args: [1], code: 'close', scope: 'interaction', stream: 'motor' } },
    { drop: { args: [1, 2, 3, 4, 5], code: 'drop', scope: 'interaction', stream: 'motor' } },
    { repeat: { args: [0], code: 're', scope: '', stream: 'meta' } },
    { exit: { args: [0], code: 'x', scope: '', stream: 'meta' } },
  ],
  [
    { exp: { args: [0], code: 'exp', scope: 'interaction', stream: 'motor' } },
    { use: { args: [1, 2, 3, 4, 5], code: 'use', scope: 'interaction', stream: 'motor' } },
    { break: { args: [0], code: 'break', scope: 'interaction', stream: 'motor' } },
    { search: { args: [0], code: 'search', scope: 'interaction', stream: 'motor' } },
  ],
  [
    { push: { args: [1, 2, 3, 4, 5], code: 'push', scope: 'interaction', stream: 'motor' } },
    { lock: { args: [1], code: 'lock', scope: 'interaction', stream: 'motor' } },
  ],
];

const translateArray = (arr, input, cmd, args) => {
  for (let i = 0; i < cmd.length; i++) {
    const tier = arr[i];

    if (tier) {
      for (let j = 0; j < tier.length; j++) {
        const [[key, data]] = Object.entries(tier[j]);

        if (key.indexOf(cmd) === 0 && data.args.indexOf(args.length) > -1) {
          return {
            name: data.alias || key,
            input,
            args,
            scope: data.scope,
            code: data.code,
            stream: data.stream,
          };
        }
      }
    }
  }

  return undefined;
};

export const translate = (input) => {
  input = input.trim();
  const [cmd, ...args] = input.match(/\S+/g) || [];
  if (!cmd) return { name: 'none', input, args, code: null, scope: 'default', stream: 'info' };

  return (
    translateArray(commands, input, cmd, args)
    || { name: 'unknown', input, args, code: 'unk', scope: 'unknown', stream: 'meta' }
  );
};

export const resolve = {};
