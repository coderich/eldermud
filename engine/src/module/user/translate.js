const { Action, Stream } = require('@coderich/gameflow');

const channel = new Stream(); // Global Stream (no need for one per Unit)
const channelArgs = Array.from(new Array(100)).map((el, i) => i);

/**
 * Each set of commands is ordered by "tier"; the first tier can match cmds with 1 letter, tier 2 letters, etc.
 * The "args" attribute indicates the number of args that the input must have specified in order to be a match.
 * The "code" is a short-hand normalized code used in the game logic.
 * The "stream" indicates the Actor's stream to perform this command in.
 * The "tags" are used in-game to help categorize the command.
 */
const commands = [
  [
    { attack: { args: [1, 2, 3], code: 'a', channel: 'realm', stream: 'action' } },
    { down: { args: [0], code: 'd', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { east: { args: [0], code: 'e', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { get: { args: [1, 2, 3, 4, 5], code: 'get', channel: 'realm', stream: 'action' } },
    { look: { args: [0, 1], code: 'l', channel: 'realm', stream: 'sight' } },
    { north: { args: [0], code: 'n', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { south: { args: [0], code: 's', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { up: { args: [0], code: 'u', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { west: { args: [0], code: 'w', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { i: { args: [0], code: 'i', name: 'inventory', channel: 'realm', stream: 'info' } },
    { x: { args: [0], code: 'x', name: 'exit', channel: 'realm', stream: 'action' } },
    { '?': { args: [0, 1, 2, 3, 4, 5], code: 'help', name: 'help', channel: 'realm', stream: 'info' } },
  ],
  [
    { ne: { args: [0], code: 'ne', name: 'northeast', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { nw: { args: [0], code: 'nw', name: 'northwest', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { se: { args: [0], code: 'se', name: 'southeast', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { sw: { args: [0], code: 'sw', name: 'southwest', channel: 'realm', stream: 'action', tags: ['direction'] } },
    // { ul: { args: [1], code: 'unlock', name: 'unlock', channel: 'realm', stream: 'action' } },
    // { equip: { args: [1, 2, 3, 4, 5], code: 'equip', stream: 'action' } },
    { list: { args: [0], code: 'list', channel: 'realm', stream: 'action' } },
    { open: { args: [1], code: 'open', channel: 'realm', stream: 'action' } },
    { close: { args: [1], code: 'close', channel: 'realm', stream: 'action' } },
    { stats: { args: [0], code: 'stats', channel: 'realm', stream: 'info' } },
    { drop: { args: [1, 2, 3, 4, 5], code: 'drop', channel: 'realm', stream: 'action' } },
    // { repeat: { args: [0], code: 're', stream: '' } },
    { exit: { args: [0], code: 'x', channel: 'realm', stream: 'action' } },
  ],
  [
    { ask: { args: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], code: 'ask', channel: 'realm', stream: 'voice' } },
    // { exp: { args: [0], code: 'exp', stream: 'action' } },
    // { use: { args: [1, 2, 3, 4, 5], code: 'use', stream: 'action' } },
    { buy: { args: [1, 2, 3, 4, 5], code: 'buy', channel: 'realm', stream: 'action' } },
    { sell: { args: [1, 2, 3, 4, 5], code: 'sell', channel: 'realm', stream: 'action' } },
    { break: { args: [0], code: 'break', channel: 'info', stream: 'info' } },
    { search: { args: [0], code: 'search', channel: 'realm', stream: 'action' } },
    { follow: { args: [1, 2], code: 'follow', channel: 'realm', stream: 'action' } },
    { leave: { args: [0], code: 'leave', channel: 'realm', stream: 'action' } },
    { inventory: { args: [0], code: 'i', channel: 'realm', stream: 'info' } },
    { frontrank: { args: [0], code: 'frontrank', channel: 'realm', stream: 'action' } },
    { midrank: { args: [0], code: 'midrank', channel: 'realm', stream: 'action' } },
    { backrank: { args: [0], code: 'backrank', channel: 'realm', stream: 'action' } },
    // { lock: { args: [1], code: 'lock', stream: 'action' } },
    // { unlock: { args: [1], code: 'unlock', channel: 'realm', stream: 'action' } },
    // { remove: { args: [1, 2, 3], code: 'remove', stream: 'action' } },
  ],
  [
    // { push: { args: [1, 2, 3, 4, 5], code: 'push', stream: 'action' } },
    // { lock: { args: [1], code: 'lock', stream: 'action' } },
    { rest: { args: [0], code: 'rest', channel: 'realm', stream: 'action' } },
    { stand: { args: [0], code: 'stand', channel: 'realm', stream: 'action' } },
    // { help: { args: [0], code: 'help', channel: 'realm', stream: 'info' } },
    { invite: { args: [1, 2], code: 'invite', channel: 'realm', stream: 'action' } },

    // Talents
    // { dble: { args: [1], code: 'talent.dble', stream: 'talent' } },
    // { hail: { args: [0], code: 'talent.hail', stream: 'talent' } },
    { mend: { args: [0, 1], code: 'mend', channel: 'realm', stream: 'action' } },
    // { rage: { args: [0], code: 'talent.rage', stream: 'talent' } },
    { stab: { args: [0], code: 'stab', channel: 'realm', stream: 'tactic' } },
    // { tote: { args: [1], code: 'talent.tote', stream: 'talent' } },
    { vamp: { args: [1], code: 'vamp', channel: 'realm', stream: 'action' } },

    // Channels
    { '/gos': { args: channelArgs, name: 'gos', code: 'gos', channel, stream: 'info' } },
    { '/auc': { args: channelArgs, name: 'auc', code: 'auc', channel, stream: 'info' } },
  ],
  [
    { greet: { args: [0, 1, 2, 3, 4, 5], code: 'greet', channel: 'realm', stream: 'voice' } },
    { train: { args: [1], code: 'train', channel: 'realm', stream: 'action' } },
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
            ...data,
            name: data.name || key,
            input,
            args,
          };
        }
      }
    }
  }

  return { name: 'unknown', input, args, code: 'unk', channel: 'realm' };
};

Action.define('translate', (input, { actor }) => {
  input = input.trim().toLowerCase();
  const [cmd, ...args] = input.match(/\S+/g) || [];
  return cmd ? translateArray(commands, input, cmd, args) : { name: 'none', input, args, code: null, channel: 'realm' };
});
