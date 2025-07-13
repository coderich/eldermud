const { Action } = require('@coderich/gameflow');

Action.define('mainMenu', [
  async (_, { actor }) => {
    await actor.send('text', APP.styleText('highlight', '\n--- Main Menu ---'));

    await actor.send('text', APP.table([
      ['[E]', 'Enter the Realm!'],
      ['[T]', 'Tutorial'],
      ['[A]', 'About'],
      ['[X]', 'Exit'],
    ], { sep: '' }));

    const { text: selection } = await actor.query('Please make a selection');

    switch (selection.toLowerCase()) {
      case 'e': return actor.perform('enter');
      // case 't': return actor.perform('tutorial').then(() => actor.perform('mainMenu'));
      // case 'a': return actor.perform('about').then(() => actor.perform('mainMenu'));
      case 'x': return actor.disconnect('exit');
      default: return actor.perform('mainMenu');
    }
  },
]);
