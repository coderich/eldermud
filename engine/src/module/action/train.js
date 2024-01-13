const { Action } = require('@coderich/gameflow');

Action.define('train', [
  async ({ args }, { actor, abort }) => {
    const [stat] = args;
    const stats = ['str', 'dex', 'int', 'wis'];
    if (!stats.includes(stat)) return abort(`Invalid stat specified; must be one of ${stats}`);
    return actor.perform('affect', { lvl: 1, [stat]: 1 });
  },
]);
