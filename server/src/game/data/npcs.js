export default {
  'npc.cityGuard': {
    id: 'npc.cityGuard',
    name: 'City guard',
    pronoun: 'he',
    triggers: [],
  },

  'npc.oldMan': {
    id: 'npc.oldMan',
    name: 'Wise old man',
    pronoun: 'he',
    triggers: [
      {
        id: 'greet',
        cmd: 'greet',
        effects: [
          { type: 'html', html: '<div class="dialog">Hi. I\'m a wise <strong>old</strong> man.</div>' },
          { type: 'increase:exp', roll: 10, limit: 1 },
        ],
      },
      {
        id: 'combat',
        cmd: 'ask',
        keywords: ['combat', 'fight'],
        effects: [
          { type: 'html', html: '<div class="dialog">It\'s all about courage, strategy, and luck!</div>' },
          { type: 'increase:exp', roll: 10, limit: 1 },
          { type: 'give:object.dagger', roll: 1, limit: 1 },
        ],
      },
      {
        id: 'bottle',
        cmd: 'give',
        keywords: ['item.bottle'],
        effects: [
          { type: 'info', info: '' },
          { type: 'increase:exp', roll: 100, limit: 1 },
          { type: 'begin:quest', quest: 'quest.1', limit: 1 },
        ],
      },
    ],
  },
};
