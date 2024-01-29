const { Action } = require('@coderich/gameflow');

Action.define('stats', [
  async (_, { actor }) => {
    const stats = await actor.mGet(['hp', 'ma', 'exp', 'str', 'dex', 'int', 'wis', 'lvl', 'class']);

    const data = Object.entries({
      Name: actor.name,
      Level: `${stats.lvl}`,
      Race: 'Dragonborn',
      Class: `${CONFIG.get(stats.class).name}`,
      Health: `${stats.hp}/${actor.mhp}`,
      Mana: `${stats.ma}/${actor.mma}`,
      Soul: `${stats.exp}`,
      Strength: `${stats.str}`,
      Dexterity: `${stats.dex}`,
      Intellect: `${stats.int}`,
      Wisdom: `${stats.wis}`,
      Armor: `${actor.ac}/${actor.dr}`,
      Accuracy: `${actor.acc}`,
      Dodge: '0',
      Parry: '0',
      Block: `${actor.dr}`,
      Stealth: '0',
      Crits: '0',
      Poise: '0',
      Riposte: '0',
      // Talents: actor.talents.map(talent => talent.name).join(', '),
      Abilities: actor.abilities.map(ability => ability.name).join(', '),
      Traits: actor.traits.map(trait => trait.name).join(', '),
    }).reduce((prev, [key, value]) => {
      return Object.assign(prev, { [key]: [APP.styleText('stat', `${key}:`), APP.styleText('keyword', `${value}  `)] });
    }, {});

    const Empty = [APP.styleText('stat', ''), APP.styleText('keyword', '')];

    const table1 = APP.table([
      [...data.Name, ...data.Level, ...data.Accuracy],
      [...data.Race, ...data.Class, ...data.Dodge],
      [...data.Health, ...data.Mana, ...data.Parry],
      [...data.Soul, ...data.Armor, ...data.Block],
      [...Empty, ...Empty, ...data.Poise],
      [...Empty, ...Empty, ...data.Riposte],
      [...data.Strength, ...data.Dexterity, ...data.Stealth],
      [...data.Intellect, ...data.Wisdom, ...data.Crits],
    ], { sep: '' });

    const table2 = APP.table([
      // [...data.Talents],
      [...data.Abilities],
      [...data.Traits],
    ], { sep: '' });

    actor.send('text', `\n${table1}\n\n${table2}\n`);
  },
]);
