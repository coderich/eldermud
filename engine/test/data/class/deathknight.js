module.exports = {
  name: 'Death Knight',
  pri: 'str',
  str: 12,
  dex: 10,
  int: 4,
  wis: 4,
  crit: 0,
  dodge: 0,
  talents: ['${self:talent.consume}'],
  traits: ['${self:trait.manaforce}', '${self:trait.terrifying}', '${self:trait.killerblow}'],
  attacks: ['${self:attack.sword}'],
  description: 'Death Knights wield unholy powers of death and decay. Often risen from fallen heroes or corrupted knights, they are relentless in their pursuit of power and dominance on the battlefield.',
};
