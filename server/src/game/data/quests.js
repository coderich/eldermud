/* eslint-disable no-template-curly-in-string, no-multi-str */
export default {
  'quest.weaponsmith': {
    id: 'quest.weaponsmith',
    triggers: [
      // {
      //   id: 'greet',
      //   event: 'npc:greet',
      //   criteria: "this.npc.id === 'npc.weaponsmith'",
      //   effects: [
      //     { type: 'progress:quest', quest: 'quest.weaponsmith', limit: 1 },
      //     { type: 'increase:exp', roll: 50, limit: 1 },
      //   ],
      // },
      {
        id: 'check',
        event: 'post:move',
        criteria: "this.to.id === 'room.weapons'",
        effects: [
          { type: 'progress:quest', quest: 'quest.weaponsmith', limit: 1 },
          { type: 'increase:exp', roll: 50, limit: 1 },
        ],
      },
    ],
  },
};
