const { Action } = require('@coderich/gameflow');

/**
 * Each set of commands is ordered by "tier" giving priority to them when it comes to matching.
 * The "args" attribute indicates the number of args that the input must have specified in order to be a match.
 * The "code" is a short-hand code used in the game logic.
 * The "scope" helps narrow down how to handle this action.
 */
const commands = [
  [
    { attack: { args: [1, 2, 3], code: 'a', scope: 'action' } },
    { down: { args: [0], code: 'd', scope: 'navigation' } },
    { east: { args: [0], code: 'e', scope: 'navigation' } },
    { get: { args: [1, 2, 3, 4, 5], code: 'get', scope: 'action' } },
    { inventory: { args: [0], code: 'i', scope: '' } },
    { look: { args: [0, 1], code: 'l', scope: 'action' } },
    { north: { args: [0], code: 'n', scope: 'navigation' } },
    { south: { args: [0], code: 's', scope: 'navigation' } },
    { up: { args: [0], code: 'u', scope: 'navigation' } },
    { west: { args: [0], code: 'w', scope: 'navigation' } },
    { x: { args: [0], code: 'x', alias: 'exit', scope: '' } },
    { '?': { args: [0, 1, 2], code: 'help', alias: 'help', scope: 'action' } },
  ],
  [
    { ne: { args: [0], code: 'ne', alias: 'northeast', scope: 'navigation' } },
    { nw: { args: [0], code: 'nw', alias: 'northwest', scope: 'navigation' } },
    { se: { args: [0], code: 'se', alias: 'southeast', scope: 'navigation' } },
    { sw: { args: [0], code: 'sw', alias: 'southwest', scope: 'navigation' } },
    { ul: { args: [1], code: 'unlock', alias: 'unlock', scope: 'action' } },
    { equip: { args: [1, 2, 3, 4, 5], code: 'equip', scope: 'action' } },
    { open: { args: [1], code: 'open', scope: 'action' } },
    { close: { args: [1], code: 'close', scope: 'action' } },
    { drop: { args: [1, 2, 3, 4, 5], code: 'drop', scope: 'action' } },
    { repeat: { args: [0], code: 're', scope: '' } },
    { exit: { args: [0], code: 'x', scope: '' } },
  ],
  [
    { ask: { args: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], code: 'ask', scope: 'action' } },
    { exp: { args: [0], code: 'exp', scope: 'action' } },
    { use: { args: [1, 2, 3, 4, 5], code: 'use', scope: 'action' } },
    { buy: { args: [1, 2, 3, 4, 5], code: 'buy', scope: 'action' } },
    { sell: { args: [1, 2, 3, 4, 5], code: 'sell', scope: 'action' } },
    { break: { args: [0], code: 'break', scope: 'action' } },
    { search: { args: [0], code: 'search', scope: 'action' } },
    { lock: { args: [1], code: 'lock', scope: 'action' } },
    { unlock: { args: [1], code: 'unlock', scope: 'action' } },
    { remove: { args: [1, 2, 3], code: 'remove', scope: 'action' } },
  ],
  [
    { push: { args: [1, 2, 3, 4, 5], code: 'push', scope: 'action' } },
    { lock: { args: [1], code: 'lock', scope: 'action' } },
    { list: { args: [0], code: 'list', scope: 'action' } },
    { help: { args: [0], code: 'help', scope: 'action' } },

    // Talents
    { dble: { args: [1], code: 'talent.dble', scope: 'talent' } },
    { hail: { args: [0], code: 'talent.hail', scope: 'talent' } },
    { mend: { args: [0, 1], code: 'talent.mend', scope: 'talent' } },
    { rage: { args: [0], code: 'talent.rage', scope: 'talent' } },
    { stab: { args: [1, 2, 3], code: 'talent.stab', scope: 'talent' } },
    { tote: { args: [1], code: 'talent.tote', scope: 'talent' } },
    { vamp: { args: [1], code: 'talent.vamp', scope: 'talent' } },

    // Channels
    { '/gos': { args: [0], code: 'gos', scope: 'channel' } },
    { '/auc': { args: [0], code: 'auc', scope: 'channel' } },
    { '/log': { args: [0], code: 'log', scope: 'channel' } },
    { '/his': { args: [0], code: 'his', scope: 'channel' } },
  ],
  [
    { greet: { args: [0, 1, 2, 3, 4, 5], code: 'greet', scope: 'action' } },
    { train: { args: [1], code: 'train', scope: 'action' } },
    { learn: { args: [1], code: 'learn', scope: 'action' } },
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
            scope: data.scope,
            code: data.code,
          };
        }
      }
    }
  }

  return { name: 'unknown', input, args, code: 'unk', scope: 'unknown' };
};

Action.define('translate', (input, { actor }) => {
  input = input.text.trim().toLowerCase();
  const [cmd, ...args] = input.match(/\S+/g) || [];
  return cmd ? translateArray(commands, input, cmd, args) : { name: 'none', input, args, code: null, scope: 'default' };
});
