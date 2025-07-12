const { Action } = require('@coderich/gameflow');

Action.define('upgrade', [
  async ({ args }, { actor, abort }) => {
    if (!args.length) return abort('Todo: ');
    const [topic, ...rest] = args;
    const topics = ['weapon', 'armor', 'talent', 'trait'];

    switch (topic) {
      case 'weapon': case 'armor': {
        return CONFIG.get(await actor.get(topic));
      }
      case 'talent': case 'trait': {
        const items = await actor.get(`${topic}s`);
        return APP.target(items, rest).target;
      }
      default: {
        return abort(`Invalid topic specified; must be one of ${topics}`);
      }
    }
  },
  async (target, { actor, abort }) => {
    if (!target) return abort('Unable to find that!');
    if (!target.upgrade) return abort(`${target.name} cannot be upgraded`);
    const { text: yn } = await actor.query(`Upgrade ${target.name} for`, APP.styleText('keyword', target.upgrade.cost), 'remnants? (y/n)');
    return yn.toLowerCase() === 'y' ? target : abort();
  },
]);
