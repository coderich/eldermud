const { Action } = require('@coderich/gameflow');

const ranks = ['frontrank', 'midrank', 'backrank'];

Action.define('party', [
  async (_, { actor }) => {
    const units = await Promise.all(Array.from(actor.$party).map(el => el.mGet('name', 'class', 'ma', 'mma', 'hp', 'mhp', '$partyRank')));
    actor.send('text', 'The following people are in your party:');
    actor.send('text', APP.table([
      ...units.map(unit => [
        '  ',
        unit.name,
        `(${CONFIG.get(unit.class).name})`,
        `[MA:${Math.floor((unit.ma / unit.mma) * 100)}%]`,
        `[HP:${Math.floor((unit.hp / unit.mhp) * 100)}%]`,
        `- ${ranks[unit.$partyRank - 1]}`,
      ]),
    ], { sep: '' }));
  },
]);
