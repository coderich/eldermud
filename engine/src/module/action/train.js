const { Action } = require('@coderich/gameflow');

Action.define('train', [
  async ({ args }, { actor, abort }) => {
    const [stat] = args;
    const stats = ['str', 'dex', 'int', 'wis', 'con', 'cha'];
    if (!stats.includes(stat)) return abort(`Invalid stat specified; must be one of ${stats}`);
    await actor.send('text', APP.styleText('boost', 'You reach the next level!'));
    await REDIS.rPush(`${actor}.levels`, stat);
    return actor.perform('affect', { lvl: 1 });
  },
]);
