const { Actor, Action } = require('@coderich/gameflow');

Action.define('who', [
  async (_, { actor }) => {
    const actors = await Promise.all(Object.values(Actor).map(el => el.mGet('name', 'class')));
    await actor.send('text', APP.styleText('highlight', 'Current Adventurers:'));
    return actor.send('text', actors.map(el => `  ${el.name}\t(${CONFIG.get(el.class).name})`).join('\n'));
  },
]);
