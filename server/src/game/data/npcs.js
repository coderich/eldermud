/* eslint-disable no-template-curly-in-string, no-multi-str */
export default {
  'npc.cityGuard': {
    id: 'npc.cityGuard',
    name: 'City guard',
    pronoun: 'he',
    triggers: [
      {
        id: 'greet',
        cmd: 'greet',
        effects: [
          {
            type: 'html',
            html: "\
              <div class='dialog'>\
                <p>Greetings traveler!</p>\
                <p>My name's ${this.npc.name}; I'm a member of Firebend's Royal Guard.</p>\
              </div>\
            ",
          },
          { type: 'increase:exp', roll: 10, limit: 1 },
        ],
      },
    ],
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
          {
            type: 'html',
            html: "\
              <div class='dialog'>\
                <p>${this.npc.name} looks at you and grumbles:</p>\
                <p>That scoundrel <span class='highlight'>Weaponsmith</span>! He's ducking me, I just know it...</p>\
              </div>\
            ",
          },
          { type: 'increase:exp', roll: 10, limit: 1 },
        ],
      },
      {
        id: 'quest',
        cmd: 'ask',
        keywords: ['weaponsmith'],
        effects: [
          { type: 'html', html: '<div class="dialog">Go check on him!</div>' },
          { type: 'begin:quest', quest: 'quest.weaponsmith', limit: 1 },
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
