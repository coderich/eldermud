const { Action, Stream } = require('@coderich/gameflow');

const channel = new Stream(); // Global Stream (no need for one per Unit)
const channelArgs = Array.from(new Array(100)).map((el, i) => i);
const argsMap = {
  self: [0],
  none: [0],
  target: [0],
  ally: [0, 1, 2, 3, 4, 5],
  other: [0, 1, 2, 3, 4, 5],
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
    { attack: { args: [0], channel: 'realm', stream: 'action', target: 'target' } },
    { attack: { args: [1, 2, 3], channel: 'realm', stream: 'action', target: 'other' } },
    { down: { args: [0], name: 'move', code: 'd', channel: 'realm', stream: 'action', tags: ['direction'], target: 'exit' } },
    { east: { args: [0], name: 'move', code: 'e', channel: 'realm', stream: 'action', tags: ['direction'], target: 'exit' } },
    { north: { args: [0], name: 'move', code: 'n', channel: 'realm', stream: 'action', tags: ['direction'], target: 'exit' } },
    { south: { args: [0], name: 'move', code: 's', channel: 'realm', stream: 'action', tags: ['direction'], target: 'exit' } },
    { up: { args: [0], name: 'move', code: 'u', channel: 'realm', stream: 'action', tags: ['direction'], target: 'exit' } },
    { west: { args: [0], name: 'move', code: 'w', channel: 'realm', stream: 'action', tags: ['direction'], target: 'exit' } },
    { get: { args: [1, 2, 3, 4, 5], channel: 'realm', stream: 'action' } },
    { look: { args: [0, 1, 2, 3], channel: 'realm', stream: 'sight' } },
    { i: { args: [0], name: 'inventory', channel: 'realm', stream: 'info' } },
    { x: { args: [0], name: 'exit', channel: 'realm', stream: 'action' } },
    { '?': { args: [0, 1, 2, 3, 4, 5], name: 'help', channel: 'realm', stream: 'info' } },
  ],
  [
    { ne: { args: [0], name: 'move', code: 'ne', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { nw: { args: [0], name: 'move', code: 'nw', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { se: { args: [0], name: 'move', code: 'se', channel: 'realm', stream: 'action', tags: ['direction'] } },
    { sw: { args: [0], name: 'move', code: 'sw', channel: 'realm', stream: 'action', tags: ['direction'] } },
    // { ul: { args: [1], code: 'unlock', name: 'unlock', channel: 'realm', stream: 'action' } },
    // { equip: { args: [1, 2, 3, 4, 5], code: 'equip', stream: 'action' } },
    { list: { args: [0], channel: 'realm', stream: 'info', target: 'shop' } },
    { open: { args: [1, 2, 3], channel: 'realm', stream: 'action' } },
    { close: { args: [1], channel: 'realm', stream: 'action' } },
    { stats: { args: [0], channel: 'realm', stream: 'info' } },
    { drop: { args: [1, 2, 3, 4, 5], channel: 'realm', stream: 'action' } },
    { actions: { args: [0], channel: 'realm', stream: 'info' } },
    // { repeat: { args: [0], stream: '' } },
    { exit: { args: [0], channel: 'realm', stream: 'action' } },
  ],
  [
    { ask: { args: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], channel: 'realm', stream: 'voice', target: 'npc' } },
    { who: { args: [0], channel: 'realm', stream: 'info' } },
    // { exp: { args: [0], stream: 'action' } },
    { use: { args: [1, 2, 3, 4, 5], channel: 'realm', stream: 'action' } },
    { buy: { args: [1, 2, 3, 4, 5], channel: 'realm', stream: 'action', target: 'shop' } },
    { tnl: { args: [0], channel: 'realm', stream: 'info' } },
    { exp: { args: [0], name: 'tnl', channel: 'realm', stream: 'info' } },
    { sell: { args: [1, 2, 3, 4, 5], channel: 'realm', stream: 'action', target: 'shop' } },
    { break: { args: [0], channel: 'info', stream: 'info' } },
    { search: { args: [0, 1, 2, 3, 4, 5], channel: 'realm', stream: 'action' } },
    { follow: { args: [1, 2], channel: 'realm', stream: 'gesture', target: 'other' } },
    { leave: { args: [0], channel: 'realm', stream: 'gesture' } },
    { inventory: { args: [0], channel: 'realm', stream: 'info' } },
    { party: { args: [0], channel: 'realm', stream: 'info' } },
    { frontrank: { args: [0], channel: 'realm', stream: 'tactic' } },
    { midrank: { args: [0], channel: 'realm', stream: 'tactic' } },
    { backrank: { args: [0], channel: 'realm', stream: 'tactic' } },
    // { lock: { args: [1], stream: 'action' } },
    // { unlock: { args: [1], channel: 'realm', stream: 'action' } },
    { gossip: { args: channelArgs, channel, stream: 'info' } },
    { auction: { args: channelArgs, channel, stream: 'info' } },
    { talents: { args: [0], channel, stream: 'info' } },
  ],
  [
    // { lock: { args: [1], stream: 'action' } },
    // { rest: { args: [0], channel: 'realm', stream: 'action' } },
    { stand: { args: [0], channel: 'realm', stream: 'action' } },
    { invite: { args: [1, 2], channel: 'realm', stream: 'gesture', target: 'other' } },
    { harvest: { args: [1, 2, 3, 4, 5], channel: 'realm', stream: 'action', target: 'corpse' } },

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
  if (cmd.startsWith('/')) return { name: 'telepath', input, args: [cmd.substring(1), ...args], channel: 'realm', stream: 'info', target: 'realm' };
  if (cmd.startsWith('@')) return { name: 'at', input, args: [cmd.substring(1), ...args], channel: 'realm', stream: 'info', target: 'other' };

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
