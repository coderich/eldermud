const { Action } = require('@coderich/gameflow');

Action.define('stats', [
  async (_, { actor }) => {
    // const stats = await actor.mGet(['hp', 'ma', 'exp', 'str', 'dex', 'int', 'wis', 'con', 'cha', 'lvl', 'class']);

    const data = Object.entries({
      Name: actor.name,
      Level: `${actor.lvl}`,
      Leadership: `${actor.leadership}`,
      Race: `${CONFIG.get(actor.race).name}`,
      Class: `${CONFIG.get(actor.class).name}`,
      Heritage: `${CONFIG.get(actor.heritage).name}`,
      Health: `${actor.hp}/${actor.mhp}`,
      Mana: `${actor.ma}/${actor.mma}`,
      'AC/DR': `${actor.ac}/${actor.dr}`,
      Remnants: `${actor.exp}`,
      Strength: `${actor.str}`,
      Dexterity: `${actor.dex}`,
      Intellect: `${actor.int}`,
      Wisdom: `${actor.wis}`,
      Constitution: `${actor.con}`,
      Charisma: `${actor.cha}`,
      Armor: `${actor.ac}/${actor.dr}`,
      Dodge: `${actor.dodge}`,
      Parry: `${actor.parry}`,
      Stealth: `${actor.stealth}`,
      Crits: `${actor.crits}`,
      Riposte: `${actor.riposte}`,
      Encumbrance: `${actor.enc}`,
      Perception: `${actor.perception}`,
      Thievery: `${actor.thievery}`,
      Traps: `${actor.traps}`,
      Lockpicks: `${actor.lockpicks}`,
      Tracking: `${actor.tracking}`,
      Willpower: `${actor.mr}`,
      Talents: actor.talents.map(talent => talent.name).join(', '),
      Traits: actor.traits.map(trait => trait.name).join(', '),
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
