const { Action } = require('@coderich/gameflow');

Action.define('train', [
  async ({ args }, { actor, abort }) => {
    const [stat] = args;
    const stats = ['str', 'dex', 'int', 'wis', 'con', 'cha'];
    if (!stats.includes(stat)) return abort(`Invalid stat specified; must be one of ${stats}`);

    const info = await actor.mGet(['exp', 'lvl']);
    const tnl = APP.tnl(info.lvl);
    if (info.exp < tnl) return actor.perform('tnl');

    await actor.writeln(APP.styleText('boost', 'You reach the next level!'));
    await REDIS.rPush(`${actor}.levels`, stat);
    return actor.perform('affect', { exp: -tnl });
  },
]);
