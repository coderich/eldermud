const { Action } = require('@coderich/gameflow');

Action.define('stats', [
  async (_, { actor }) => {
    const stats = await actor.mGet(['hp', 'mhp', 'ma', 'mma', 'exp']);

    const table1 = APP.table([
      ['Name:', actor.name, '', 'Level:', '1'],
      ['Race:', 'N/A', '', 'Class:', 'N/A'],
      ['AC:', '?', '', 'MR:', '?'],
      ['Hits:', `${stats.hp}/${stats.mhp}`, '', 'Mana:', `${stats.ma}/${stats.mma}`, '', 'Souls:', stats.exp],
    ], { sep: '' });

    const table2 = APP.table([
      ['Strength:', '10', ' ', 'Agility:', '20'],
      ['Intellect:', '20', ' ', 'Willpower:', '20'],
      ['Willpower:', '10', ' ', 'Charm:', '15'],
    ], { sep: '' });

    actor.send('text', `\n${table1}\n\n${table2}\n`);
    actor.send('player', `\n${table1}\n\n${table2}\n`);
  },
]);
