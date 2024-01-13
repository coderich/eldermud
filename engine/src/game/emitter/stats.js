const { Action } = require('@coderich/gameflow');

Action.define('stats', [
  async (_, { actor }) => {
    const { hp, ma, exp } = await actor.mGet(['hp', 'ma', 'exp']);

    const table1 = APP.table([
      ['Name:', actor.name, '', 'Level:', '1'],
      ['Race:', 'N/A', '', 'Class:', 'N/A'],
      ['AC:', '?', '', 'MR:', '?'],
      ['Hits:', `${hp}/${actor.mhp}`, '', 'Mana:', `${ma}/${actor.mma}`, '', 'Souls:', exp],
    ], { sep: '' });

    const table2 = APP.table([
      ['Strength:', '10', ' ', 'Agility:', '20'],
      ['Intellect:', '20', ' ', 'Willpower:', '20'],
      ['Willpower:', '10', ' ', 'Charm:', '15'],
    ], { sep: '' });

    actor.send('text', `\n${table1}\n\n${table2}\n`);
  },
]);
