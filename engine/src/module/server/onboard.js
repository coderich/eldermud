const { Action } = require('@coderich/gameflow');

const displayMenu = async (actor) => {
  const classes = Object.values(CONFIG.get('class'));
  const races = Object.values(CONFIG.get('race'));

  await actor.send('text', APP.styleText('highlight', '\n--- Create a Character ---'));

  await actor.send('text', APP.table([
    ...races.map((el, i) => [`[${i + 1}]`, el.name, ' ', `[${String.fromCharCode(i + 65)}]`, classes[i].name]),
    ['[X]', 'Exit Menu', '', ''],
  ], { sep: '' }));
};

const resolveSelection = async (actor) => {
  const selection = await actor.query(APP.styleBlockText('dialog', [
    { text: '? <topic>', style: 'keyword' },
  ], 'Select a race/class (eg. "1C") or "? <topic>" to learn more')).then(({ text }) => text.toLowerCase());
  if (selection === 'x') return actor.perform('mainMenu');
  if (selection.startsWith('?')) return actor.perform('translate', selection).then(cmd => actor.perform('help', APP.targetHelp(cmd.args))).then(() => resolveSelection(actor));
  return actor.perform('onboard');
};

Action.define('onboard', async (_, { actor }) => {
  const info = await actor.mGet('class', 'race');

  if (!info.class || !info.race) {
    await displayMenu(actor);
    await resolveSelection(actor);
  }

  return Promise.resolve();
});
