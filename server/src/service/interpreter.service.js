const commands = [
  [
    { attack: { args: [0, 1] } },
    { down: { args: [0] } },
    { east: { args: [0] } },
    { get: { args: [1] } },
    { inventory: { args: [0] } },
    { look: { args: [0, 1] } },
    { north: { args: [0] } },
    { south: { args: [0] } },
    { up: { args: [0] } },
    { west: { args: [0] } },
    { x: { args: [0], alias: 'exit' } },
  ],
  [
    { ne: { args: [0], alias: 'northeast' } },
    { nw: { args: [0], alias: 'northwest' } },
    { se: { args: [0], alias: 'southeast' } },
    { sw: { args: [0], alias: 'southwest' } },
    { open: { args: [1] } },
    { repeat: { args: [0] } },
    { exit: { args: [0] } },
  ],
];

const translateArray = (arr, cmd, args) => {
  for (let i = 0; i < cmd.length; i++) {
    const tier = arr[i];

    if (tier) {
      for (let j = 0; j < tier.length; j++) {
        const [[key, data]] = Object.entries(tier[j]);
        if (key.indexOf(cmd) === 0 && data.args.indexOf(args.length) > -1) return { name: data.alias || key, args };
      }
    }
  }

  return undefined;
};

exports.translate = (input) => {
  const [cmd, ...args] = input.match(/\S+/g) || [];
  if (!cmd) return { cmd: 'none', args };

  return (
    translateArray(commands, cmd, args)
    || { cmd: 'unknown', args }
  );
};
