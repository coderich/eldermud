const { Action, Stream } = require('@coderich/gameflow');

const channel = new Stream(); // Global Stream (no need for one per Unit)
const channelArgs = Array.from(new Array(100)).map((el, i) => i);
const argsMap = {
  none: [0],
  target: [0],
  ally: [0, 1, 2, 3, 4, 5],
  enemy: [1, 2, 3, 4, 5],
  creature: [1, 2, 3, 4, 5],
};

/**
 * Each set of commands is ordered by "tier"; the first tier can match cmds with 1 letter, tier 2 letters, etc.
 * The "args" attribute indicates the number of args that the input must have specified in order to be a match.
 * The "code" is a short-hand normalized code used in the game logic.
 * The "stream" indicates the Actor's stream to perform this command in.
 * The "tags" are used in-game to help categorize the command.
 */
const commands = [
  [
    { attack: { args: [0], code: 'a', channel: 'realm', stream: 'action', target: 'target' } },
    { attack: { args: [1, 2, 3], code: 'a', channel: 'realm', stream: 'action', target: 'other' } },
    { down: { args: [0], code: 'd', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { east: { args: [0], code: 'e', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { get: { args: [1, 2, 3, 4, 5], code: 'get', channel: 'realm', stream: 'action' } },
    { look: { args: [0, 1, 2, 3], code: 'l', channel: 'realm', stream: 'sight' } },
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
    { list: { args: [0], code: 'list', channel: 'realm', stream: 'info', target: 'shop' } },
    { open: { args: [1, 2, 3], code: 'open', channel: 'realm', stream: 'action' } },
    { close: { args: [1], code: 'close', channel: 'realm', stream: 'action' } },
    { stats: { args: [0], code: 'stats', channel: 'realm', stream: 'info' } },
    { drop: { args: [1, 2, 3, 4, 5], code: 'drop', channel: 'realm', stream: 'action' } },
    { actions: { args: [0], code: 'actions', channel: 'realm', stream: 'info' } },
    // { repeat: { args: [0], code: 're', stream: '' } },
    { exit: { args: [0], code: 'x', channel: 'realm', stream: 'action' } },
  ],
  [
    { ask: { args: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], code: 'ask', channel: 'realm', stream: 'voice', target: 'npc' } },
    { who: { args: [0], code: 'who', channel: 'realm', stream: 'info' } },
    // { exp: { args: [0], code: 'exp', stream: 'action' } },
    { use: { args: [1, 2, 3, 4, 5], code: 'use', channel: 'realm', stream: 'action' } },
    { buy: { args: [1, 2, 3, 4, 5], code: 'buy', channel: 'realm', stream: 'action', target: 'shop' } },
    { tnl: { args: [0], channel: 'realm', stream: 'info' } },
    { exp: { args: [0], name: 'tnl', channel: 'realm', stream: 'info' } },
    { sell: { args: [1, 2, 3, 4, 5], code: 'sell', channel: 'realm', stream: 'action', target: 'shop' } },
    { break: { args: [0], code: 'break', channel: 'info', stream: 'info' } },
    { search: { args: [0, 1, 2, 3, 4, 5], code: 'search', channel: 'realm', stream: 'action' } },
    { follow: { args: [1, 2], code: 'follow', channel: 'realm', stream: 'gesture', target: 'other' } },
    { leave: { args: [0], code: 'leave', channel: 'realm', stream: 'gesture' } },
    { inventory: { args: [0], code: 'i', channel: 'realm', stream: 'info' } },
    { party: { args: [0], code: 'party', channel: 'realm', stream: 'info' } },
    { frontrank: { args: [0], code: 'frontrank', channel: 'realm', stream: 'tactic' } },
    { midrank: { args: [0], code: 'midrank', channel: 'realm', stream: 'tactic' } },
    { backrank: { args: [0], code: 'backrank', channel: 'realm', stream: 'tactic' } },
    // { lock: { args: [1], code: 'lock', stream: 'action' } },
    // { unlock: { args: [1], code: 'unlock', channel: 'realm', stream: 'action' } },
    { gossip: { args: channelArgs, code: 'gossip', channel, stream: 'info' } },
    { auction: { args: channelArgs, code: 'auction', channel, stream: 'info' } },
    { talents: { args: [0], code: 'talents', channel, stream: 'info' } },
  ],
  [
    // { lock: { args: [1], code: 'lock', stream: 'action' } },
    // { rest: { args: [0], code: 'rest', channel: 'realm', stream: 'action' } },
    { stand: { args: [0], code: 'stand', channel: 'realm', stream: 'action' } },
    { invite: { args: [1, 2], code: 'invite', channel: 'realm', stream: 'gesture', target: 'other' } },
    { harvest: { args: [1, 2, 3, 4, 5], code: 'harvest', channel: 'realm', stream: 'action', target: 'corpse' } },

    // Talents
    ...Object.entries(CONFIG.get('talent')).map(([key, talent]) => {
      return {
        [talent.code]: {
          args: argsMap[talent.target],
          name: 'talent',
          code: talent.code,
          channel: 'realm',
          stream: talent.stream || 'tactic',
          target: talent.target,
          tags: ['talent'],
        },
      };
    }),
  ],
  [
    { greet: { args: [0, 1, 2, 3, 4, 5], channel: 'realm', stream: 'voice', target: 'other' } },
    { train: { args: [1], channel: 'realm', stream: 'action' } },
    { upgrade: { args: [0, 1, 2, 3, 4, 5], channel: 'realm', stream: 'action' } },
  ],
];

const translateArray = (arr, input, cmd, args) => {
  if (cmd.startsWith('/')) return { name: 'telepath', input, args: [cmd.substring(1), ...args], code: 'tele', channel: 'realm', stream: 'info', target: 'realm' };
  if (cmd.startsWith('@')) return { name: 'at', input, args: [cmd.substring(1), ...args], code: 'at', channel: 'realm', stream: 'info', target: 'other' };

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
  input = input.trim();
  const [cmd, ...args] = input.match(/\S+/g) || [];
  return cmd ? translateArray(commands, input, cmd.toLowerCase(), args) : { name: 'none', input, args, code: null, channel: 'realm' };
});
