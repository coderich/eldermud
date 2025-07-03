const { Action } = require('@coderich/gameflow');

Action.define('stats', [
  async (_, { actor }) => {
    const stats = await actor.mGet(
      ...['name', 'hp', 'ma', 'mhp', 'mma', 'ac', 'dr', 'mr', 'enc'],
      ...['dodge', 'parry', 'stealth', 'crits', 'riposte', 'perception'],
      ...['thievery', 'traps', 'lockpicks', 'tracking'],
      ...['str', 'dex', 'int', 'wis', 'con', 'cha', 'talents', 'traits'],
      ...['exp', 'lvl', 'class', 'race', 'heritage', 'leadership', 'weapon', 'armor'],
    );

    const data = Object.entries({
      Name: stats.name,
      Level: `${stats.lvl}`,
      Leadership: `${stats.leadership}`,
      Race: `${CONFIG.get(stats.race)?.name || '<unknown>'}`,
      Class: `${CONFIG.get(stats.class)?.name || '<unknown>'}`,
      Heritage: `${CONFIG.get(stats.heritage)?.name || '<unknown>'}`,
      Health: `${stats.hp}/${stats.mhp}`,
      Mana: `${stats.ma}/${stats.mma}`,
      'AC/DR/MR': `${stats.ac}/${stats.dr}/${stats.mr}`,
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
      Traps: `${stats.traps}`,
      Lockpicks: `${stats.lockpicks}`,
      Tracking: `${stats.tracking}`,
      Equip: `${CONFIG.get(stats.weapon).name} + ${CONFIG.get(stats.armor).name}`,
      Talents: stats.talents.map(talent => talent.name).join(', ') || '<none>',
      Traits: stats.traits.map(trait => trait.name).join(', ') || '<none>',
    }).reduce((prev, [key, value]) => {
      return Object.assign(prev, { [key]: [APP.styleText('stat', `${key}:`), APP.styleText('keyword', `${value}  `)] });
    }, {});

    const Empty = [APP.styleText('stat', ''), APP.styleText('keyword', '')];

    const table1 = APP.table([
      [...data.Name, ...data.Leadership, ...data.Dodge],
      [...data.Race, ...data['AC/DR/MR'], ...data.Parry],
      [...data.Class, ...data.Health, ...data.Riposte],
      [...data.Level, ...data.Mana, ...data.Stealth],
      [...Empty, ...Empty, ...data.Crits],
      [...Empty, ...Empty, ...data.Tracking],
      [...data.Strength, ...data.Dexterity, ...data.Traps],
      [...data.Intellect, ...data.Wisdom, ...data.Lockpicks],
      [...data.Constitution, ...data.Charisma, ...data.Perception],
    ], { sep: '' });

    const table2 = APP.table([
      [...data.Equip],
      [...data.Traits],
      [...data.Talents],
    ], { sep: '' });

    actor.send('text', `\n${table1}\n\n\n${table2}\n`);
  },
]);
