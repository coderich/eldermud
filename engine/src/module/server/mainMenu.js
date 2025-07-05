const { Action } = require('@coderich/gameflow');

Action.define('mainMenu', [
  async (_, { actor }) => {
    await actor.send('text', APP.styleText('highlight', '\n--- Main Menu ---'));

    await actor.send('text', APP.table([
      ['[E]', 'Enter the Realm!'],
      ['[T]', 'Tutorial'],
      ['[X]', 'Logout'],
    ], { sep: '' }));

    const { text: selection } = await actor.query('Please make a selection');

    switch (selection.toLowerCase()) {
      case 'e': return actor.perform('onboard');
      // case 't': return actor.perform('tutorial').then(() => actor.perform('mainMenu'));
      case 'x': return actor.disconnect('exit');
      default: return actor.perform('mainMenu');
    }
  },
]);
