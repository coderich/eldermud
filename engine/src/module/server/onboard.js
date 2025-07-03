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

const confirmCharacter = async (actor, selection) => {
  const [a, b] = selection;
  const race = Object.values(CONFIG.get('race'))[a - 1];
  const clas = Object.values(CONFIG.get('class'))[`${b}`.charCodeAt(0) - 97];

  if (race && clas) {
    const yn = await actor.query(APP.styleText('keyword', race.name, clas.name), APP.styleText('dialog', 'is that right? (y/n)')).then(({ text }) => text.toLowerCase().trim());
    if (yn === 'y') return actor.save({ race, class: clas });
  }

  return actor.perform('onboard');
};

const resolveSelection = async (actor) => {
  const selection = await actor.query(APP.styleBlockText('dialog', [
    { text: '? <topic>', style: 'keyword' },
  ], 'Select a race/class (eg. "1C") or "? <topic>" to learn more')).then(({ text }) => text.toLowerCase().trim());
  if (selection === 'x') return actor.perform('mainMenu');
  if (selection.startsWith('?')) return actor.perform('translate', selection).then(cmd => actor.perform('help', APP.targetHelp(cmd.args))).then(() => resolveSelection(actor));
  return confirmCharacter(actor, selection);
};

Action.define('onboard', async (_, { actor }) => {
  const info = await actor.mGet('class', 'race');

  if (!info.class || !info.race) {
    await displayMenu(actor);
    await resolveSelection(actor);
  }

  return Promise.resolve();
});
