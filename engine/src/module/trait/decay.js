const { Action, Force } = require('@coderich/gameflow');

Action.define('decay', new Force([
  () => APP.timeout(5000),

  async (_, { actor, stream }) => {
    const { durability } = await actor.perform('affect', { durability: -1 });

    if (durability <= 0) {
      await actor.broadcast(`The ${actor.name} collapses to dust`);
      await actor.perform('destroy');
    }
  },
]));
