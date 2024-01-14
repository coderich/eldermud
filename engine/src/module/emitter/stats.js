const { Action } = require('@coderich/gameflow');

Action.define('stats', [
  async (_, { actor }) => {
    const stats = await actor.mGet(['hp', 'ma', 'exp', 'str', 'dex', 'int', 'wis', 'lvl', 'class']);

    const table1 = APP.table([
      ['Name:', actor.name, 'Level:', `${stats.lvl}`],
      ['Race:', 'N/A', 'Class:', `${CONFIG.get(stats.class).name}`],
      ['Health:', `${stats.hp}/${actor.mhp}`, 'Mana:', `${stats.ma}/${actor.mma}`, 'Soul:', stats.exp],
      [],
      ['Strength:', `${stats.str}`],
      ['Dexterity:', `${stats.dex}`],
      ['Intellect:', `${stats.int}`],
      ['Wisdom:', `${stats.wis}`],
    ], { sep: '' });

    actor.send('text', `\n${table1}\n`);
  },
]);
