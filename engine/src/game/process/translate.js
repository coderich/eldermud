const { Action } = require('@coderich/gameflow');

/**
 * Each set of commands is ordered by "tier"; the first tier can match cmds with 1 letter, tier 2 letters, etc.
 * The "args" attribute indicates the number of args that the input must have specified in order to be a match.
 * The "code" is a short-hand normalized code used in the game logic.
 * The "stream" indicates the Actor's stream to perform this command in.
 */
const commands = [
  [
    { attack: { args: [1, 2, 3], code: 'a', stream: 'action' } },
    { down: { args: [0], code: 'd', stream: 'action' } },
    { east: { args: [0], code: 'e', stream: 'action' } },
    { get: { args: [1, 2, 3, 4, 5], code: 'get', stream: 'action' } },
    { inventory: { args: [0], code: 'i', stream: 'info' } },
    { look: { args: [0, 1], code: 'l', stream: 'sight' } },
    { north: { args: [0], code: 'n', stream: 'action' } },
    { south: { args: [0], code: 's', stream: 'action' } },
    { up: { args: [0], code: 'u', stream: 'action' } },
    { west: { args: [0], code: 'w', stream: 'action' } },
    // { x: { args: [0], code: 'x', alias: 'exit', stream: '' } },
    { '?': { args: [0, 1, 2], code: 'help', alias: 'help', stream: 'info' } },
  ],
  [
    { ne: { args: [0], code: 'ne', alias: 'northeast', stream: 'action' } },
    { nw: { args: [0], code: 'nw', alias: 'northwest', stream: 'action' } },
    { se: { args: [0], code: 'se', alias: 'southeast', stream: 'action' } },
    { sw: { args: [0], code: 'sw', alias: 'southwest', stream: 'action' } },
    { ul: { args: [1], code: 'unlock', alias: 'unlock', stream: 'action' } },
    // { equip: { args: [1, 2, 3, 4, 5], code: 'equip', stream: 'action' } },
    { open: { args: [1], code: 'open', stream: 'action' } },
    { close: { args: [1], code: 'close', stream: 'action' } },
    // { drop: { args: [1, 2, 3, 4, 5], code: 'drop', stream: 'action' } },
    // { repeat: { args: [0], code: 're', stream: '' } },
    // { exit: { args: [0], code: 'x', stream: '' } },
  ],
  [
    { ask: { args: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], code: 'ask', stream: 'voice' } },
    // { exp: { args: [0], code: 'exp', stream: 'action' } },
    // { use: { args: [1, 2, 3, 4, 5], code: 'use', stream: 'action' } },
    // { buy: { args: [1, 2, 3, 4, 5], code: 'buy', stream: 'action' } },
    // { sell: { args: [1, 2, 3, 4, 5], code: 'sell', stream: 'action' } },
    { break: { args: [0], code: 'break', stream: 'info' } },
    { search: { args: [0], code: 'search', stream: 'action' } },
    // { lock: { args: [1], code: 'lock', stream: 'action' } },
    // { unlock: { args: [1], code: 'unlock', stream: 'action' } },
    // { remove: { args: [1, 2, 3], code: 'remove', stream: 'action' } },
  ],
  [
    // { push: { args: [1, 2, 3, 4, 5], code: 'push', stream: 'action' } },
    // { lock: { args: [1], code: 'lock', stream: 'action' } },
    // { list: { args: [0], code: 'list', stream: 'action' } },
    { rest: { args: [0], code: 'rest', stream: 'action' } },
    { stand: { args: [0], code: 'stand', stream: 'action' } },
    { help: { args: [0], code: 'help', stream: 'info' } },

    // // Talents
    // { dble: { args: [1], code: 'talent.dble', stream: 'talent' } },
    // { hail: { args: [0], code: 'talent.hail', stream: 'talent' } },
    // { mend: { args: [0, 1], code: 'talent.mend', stream: 'talent' } },
    // { rage: { args: [0], code: 'talent.rage', stream: 'talent' } },
    // { stab: { args: [1, 2, 3], code: 'talent.stab', stream: 'talent' } },
    // { tote: { args: [1], code: 'talent.tote', stream: 'talent' } },
    // { vamp: { args: [1], code: 'talent.vamp', stream: 'talent' } },

    // // Channels
    // { '/gos': { args: [0], code: 'gos', stream: 'channel' } },
    // { '/auc': { args: [0], code: 'auc', stream: 'channel' } },
    // { '/log': { args: [0], code: 'log', stream: 'channel' } },
    // { '/his': { args: [0], code: 'his', stream: 'channel' } },
  ],
  [
    { greet: { args: [0, 1, 2, 3, 4, 5], code: 'greet', stream: 'voice' } },
    // { train: { args: [1], code: 'train', stream: 'action' } },
    // { learn: { args: [1], code: 'learn', stream: 'action' } },
  ],
];

const translateArray = (arr, input, cmd, args) => {
  for (let i = 0; i < cmd.length; i++) {
    const tier = arr[i];

    if (tier) {
      for (let j = 0; j < tier.length; j++) {
        const [[key, data]] = Object.entries(tier[j]);

        if (key.indexOf(cmd) === 0 && data.args.includes(args.length)) {
          return {
            name: data.alias || key,
            input,
            args,
            stream: data.stream,
            code: data.code,
          };
        }
      }
    }
  }

  return { name: 'unknown', input, args, code: 'unk' };
};

Action.define('translate', (input, { actor }) => {
  input = input.text.trim().toLowerCase();
  const [cmd, ...args] = input.match(/\S+/g) || [];
  return cmd ? translateArray(commands, input, cmd, args) : { name: 'none', input, args, code: null };
});
