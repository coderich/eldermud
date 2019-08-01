// https://www.dmsguild.com/
// http://archive.wizards.com/default.asp?x=dnd/mwa/archiveall
// https://www.pinterest.com/glennlikes2/rpg-maps/

export default {
  'attack.punch': {
    id: 'attack.punch',
    type: 'bludgeoning',
  },
  'attack.bite': {
    id: 'attack.bite',
    type: 'piercing',
  },
  'attack.claw': {
    id: 'attack.claw',
    type: 'slashing',
  },
  'attack.sword': {
    id: 'attack.bite',
    type: 'slashing',
  },
  'quest.signup': {
    id: 'quest.signup',
    sequence: [
      { type: 'query', message: 'Next! (without lifting his eyes he says) Name?' },
      { type: 'query', message: 'Random... is that really your name?' },
      { type: 'info', message: '(pausing to scan his documents) Mumbles: another newbie...' },
      { type: 'query', message: 'What track?' },
      { type: 'query', message: '(for the first time making eye contact) A Wizard, you\'re sure about that?' },
      { type: 'info', message: '(shrugging, he hands you a pen and notebook) Down the hall, room 3.' },
      { type: 'info', message: 'Next!' },
    ],
  },
  'npc.ragnar': {
    id: 'npc.ragnar',
    memo: 'fighter trainer',
  },
  'npc.larry': {
    id: 'npc.larry',
    memo: 'training admissions',
  },
  // 'talent.rage': {
  //   id: 'talent.rage',
  //   name: 'rage',
  //   code: 'rage',
  //   cost: 100,
  //   cd: 20,
  //   type: 'instant',
  //   target: 'self',
  //   effects: [
  //     { type: 'heal', roll: 1, element: 'pure', duration: 10 },
  //     { type: 'buff-damage', roll: 1, element: 'pure', duration: 10 },
  //   ],
  // },
  // 'talent.mihe': {
  //   id: 'talent.mihe',
  //   name: 'minor healing',
  //   code: 'mihe',
  //   cost: 10,
  //   cd: 0,
  //   type: 'instant',
  //   target: 'unit',
  //   effects: [
  //     { type: 'heal', roll: '3d3+3', element: 'pure', duration: 1 },
  //   ],
  // },
  // 'talent.mmis': {
  //   id: 'talent.mmis',
  //   name: 'magic missile',
  //   code: 'mmis',
  //   cost: 10,
  //   cd: 0,
  //   type: 'combat',
  //   target: 'unit',
  //   effect: [
  //     { type: 'harm', roll: '3d3+3', element: 'magic', duration: 1 },
  //   ],
  // },
  // 'talent.stom': {
  //   id: 'talent.stom',
  //   name: 'stomp',
  //   code: 'stom',
  //   cost: 50,
  //   cd: 10,
  //   type: 'instance',
  //   target: 'room',
  //   effect: [
  //     { type: 'harm', roll: '3d3+3', element: 'physical', duration: 1 },
  //     { type: 'stun', element: 'pure', duration: 1 },
  //   ],
  // },
  // 'talent.dble': {
  //   id: 'talent.dble',
  //   name: 'double edge',
  //   code: 'dble',
  //   cost: 50,
  //   cd: 10,
  //   type: 'instance',
  //   target: 'unit',
  //   effect: [
  //     { type: 'harm', target: 'target', roll: '3d3+3', element: 'physical', duration: 1 },
  //     { type: 'harm', target: 'self', roll: '3d3+3', element: 'physical', duration: 1 },
  //   ],
  // },
};
