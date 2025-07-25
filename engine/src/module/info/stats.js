const { Action } = require('@coderich/gameflow');

Action.define('stats', [
  async (_, { actor }) => {
    const stats = await actor.mGet(
      ...['name', 'hp', 'ma', 'mhp', 'mma', 'ac', 'dr', 'mr', 'enc'],
      ...['dodge', 'block', 'parry', 'riposte', 'stealth', 'crits', 'perception'],
      ...['thievery', 'traps', 'lockpicks', 'tracking'],
      ...['str', 'dex', 'int', 'wis', 'con', 'cha', 'talents', 'traits', 'gains'],
      ...['exp', 'lvl', 'class', 'race', 'heritage', 'leadership', 'weapon', 'armor'],
    );

    const $gains = Object.entries(stats.gains).reduce((prev, [key, value]) => {
      return Object.assign(prev, { [key]: APP.styleText('muted', value ? `+${value}` : '') });
    }, {});

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
      Strength: `${stats.str}${$gains.str}`,
      Dexterity: `${stats.dex}${$gains.dex}`,
      Intellect: `${stats.int}${$gains.int}`,
      Wisdom: `${stats.wis}${$gains.wis}`,
      Constitution: `${stats.con}${$gains.con}`,
      Charisma: `${stats.cha}${$gains.cha}`,
      Armor: `${stats.ac}/${stats.dr}`,
      Dodge: `${stats.dodge}`,
      Block: `${stats.block}`,
      Parry: `${stats.parry}`,
      Riposte: `${stats.riposte}`,
      Stealth: `${stats.stealth}`,
      Crits: `${stats.crits}`,
      Encumbrance: `${stats.enc}`,
      Perception: `${stats.perception}`,
      Traps: `${stats.traps}`,
      Lockpicks: `${stats.lockpicks}`,
      Tracking: `${stats.tracking}`,
      Equip: `${CONFIG.get(stats.weapon).name} + ${CONFIG.get(stats.armor).name}`,
      Talents: Array.from(stats.talents.values()).map(talent => CONFIG.get(`${talent}.name`)).join(', ') || '<none>',
      Traits: Array.from(stats.traits.values()).filter(el => !['trait.lifeforce', 'trait.manaforce'].includes(`${el}`)).map(trait => CONFIG.get(`${trait}.name`)).join(', ') || '<none>',
    }).reduce((prev, [key, value]) => {
      return Object.assign(prev, { [key]: [APP.styleText('stat', `${key}:`), APP.styleText('keyword', `${value}  `)] });
    }, {});

    const Empty = ['', ''];
    // const Empty = [APP.styleText('stat', ''), APP.styleText('keyword', '')];

    const table1 = APP.table([
      [...data.Name, ...data.Leadership, ...data.Dodge],
      [...data.Race, ...data['AC/DR/MR'], ...data.Block],
      [...data.Class, ...data.Health, ...data.Parry],
      [...data.Level, ...data.Mana, ...data.Crits],
      [...Empty, ...Empty, ...data.Traps],
      [...Empty, ...Empty, ...data.Stealth],
      [...data.Strength, ...data.Wisdom, ...data.Tracking],
      [...data.Intellect, ...data.Charisma, ...data.Lockpicks],
      [...data.Dexterity, ...data.Constitution, ...data.Perception],
    ], { sep: '' });

    const table2 = APP.table([
      [...data.Equip],
      [...data.Traits],
      [...data.Talents],
    ], { sep: '' });

    //
    actor.send('text', `\n${table1}\n\n\n${table2}\n`);
  },
]);
