const { Action } = require('@coderich/gameflow');

Action.define('stats', [
  async (_, { actor }) => {
    const stats = await actor.mGet(
      ...['name', 'hp', 'ma', 'mhp', 'mma', 'ac', 'dr', 'mr', 'enc'],
      ...['dodge', 'parry', 'stealth', 'crits', 'riposte', 'perception'],
      ...['thievery', 'traps', 'lockpicks', 'tracking'],
      ...['str', 'dex', 'int', 'wis', 'con', 'cha', 'talents', 'traits'],
      ...['exp', 'lvl', 'class', 'race', 'heritage', 'leadership'],
    );

    const data = Object.entries({
      Name: stats.name,
      Level: `${stats.lvl}`,
      Leadership: `${stats.leadership}`,
      Race: `${CONFIG.get(stats.race)?.name}`,
      Class: `${CONFIG.get(stats.class)?.name}`,
      Heritage: `${CONFIG.get(stats.heritage)?.name}`,
      Health: `${stats.hp}/${stats.mhp}`,
      Mana: `${stats.ma}/${stats.mma}`,
      'AC/DR': `${stats.ac}/${stats.dr}`,
      Remnants: `${stats.exp}`,
      Strength: `${stats.str}`,
      Dexterity: `${stats.dex}`,
      Intellect: `${stats.int}`,
      Wisdom: `${stats.wis}`,
      Constitution: `${stats.con}`,
      Charisma: `${stats.cha}`,
      Armor: `${stats.ac}/${stats.dr}`,
      Dodge: `${stats.dodge}`,
      Parry: `${stats.parry}`,
      Stealth: `${stats.stealth}`,
      Crits: `${stats.crits}`,
      Riposte: `${stats.riposte}`,
      Encumbrance: `${stats.enc}`,
      Perception: `${stats.perception}`,
      Thievery: `${stats.thievery}`,
      Traps: `${stats.traps}`,
      Lockpicks: `${stats.lockpicks}`,
      Tracking: `${stats.tracking}`,
      Willpower: `${stats.mr}`,
      Talents: stats.talents.map(talent => talent.name).join(', '),
      Traits: stats.traits.map(trait => trait.name).join(', '),
    }).reduce((prev, [key, value]) => {
      return Object.assign(prev, { [key]: [APP.styleText('stat', `${key}:`), APP.styleText('keyword', `${value}  `)] });
    }, {});

    const Empty = [APP.styleText('stat', ''), APP.styleText('keyword', '')];

    const table1 = APP.table([
      [...data.Name, ...data.Level, ...Empty, ...Empty],
      [...data.Race, ...data['AC/DR'], ...data.Dodge, ...data.Perception],
      [...data.Class, ...data.Health, ...Empty, ...data.Thievery],
      [...data.Heritage, ...data.Mana, ...data.Parry, ...data.Traps],
      [...Empty, ...Empty, ...data.Leadership, ...data.Lockpicks],
      [...data.Strength, ...data.Dexterity, ...data.Riposte, ...data.Tracking],
      [...data.Intellect, ...data.Wisdom, ...data.Stealth, ...data.Willpower],
      [...data.Constitution, ...data.Charisma, ...data.Crits],
    ], { sep: '' });

    const table2 = APP.table([
      [...data.Traits],
      [...data.Talents],
    ], { sep: '' });

    actor.send('text', `\n${table1}\n\n${table2}\n`);
  },
]);
