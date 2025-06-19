const { Actor, Action } = require('@coderich/gameflow');

Action.define('who', [
  async (_, { actor }) => {
    const actors = await Promise.all(Object.values(Actor).map(el => el.mGet('name', 'class')));
    // await actor.send('text', APP.styleText('highlight', 'Current Adventurers:'));
    await actor.send('text', '\n', APP.table([
      ['\t', APP.styleText('highlight', 'Current Adventurers')],
      ['\t', '==================='],
      ...actors.map(el => ['\t', el.name, `(${CONFIG.get(el.class)?.name})`]),
    ], { sep: '' }), '\n');
  },
]);
