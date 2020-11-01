/* eslint-disable no-template-curly-in-string, no-multi-str */
export default {
  'quest.weaponsmith': {
    id: 'quest.weaponsmith',
    triggers: [
      {
        id: 'check',
        event: 'room:enter',
        criteria: "${this.room.id} === 'room.weapons'",
        effects: [
          { type: 'progress:quest', roll: 1, limit: 1 },
          { type: 'increase:exp', roll: 10, limit: 1 },
        ],
      },
    ],
  },
};
