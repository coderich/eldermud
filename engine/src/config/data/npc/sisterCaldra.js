module.exports = {
  name: 'Sister Caldra',
  depiction: 'A gaunt woman in soot-stained vestments, her fingers yellowed from incense ash. Her eyes are weary, yet sharp, always watching.',
  description: `
    Sister Caldra is the last remaining attendant of the Sanatorium. She keeps vigil over the plague-born and the nearly dead, offering what comfort she can—
    whether through whispered prayers or swift mercy.
    
    Known for her grim demeanor and sardonic wit, Caldra has witnessed more death than most soldiers. Though hardened by sorrow, she has not forgotten compassion.
  `,
  backstory: `
    Once a cleric of the Chapel of Elden, Caldra volunteered to tend the sick when the Plague first reached Eldenfort.
    She was sealed in with the dying when the quarantine was declared, presumed lost with the rest. Somehow, she survived.
    
    Over the years, Caldra has become part of the Sanatorium itself—guiding the newly awakened, communing with the nearly dead, and preserving what little hope remains underground.
    To her, survival is sacred... but so is surrender.
  `,
  room: '${self:map.eldenfortSanatorium.rooms.caldraRetreat}',
  str: 8,
  dex: 8,
  int: 10,
  wis: 14,
  con: 9,
  cha: 12,
  lvl: 4,
  traits: [
    '${self:trait.sanctuary}',
  ],
};
