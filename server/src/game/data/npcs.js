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
            criteria: "!this.user.history['quest.weaponsmith']",
            type: 'html',
            html: "\
              <div class='dialog'>\
                <p>${this.npc.name} looks at you and grumbles:</p>\
                <p>That scoundrel <span class='highlight'>Weaponsmith</span>! He's ducking me, I just know it...</p>\
              </div>\
            ",
          },
          {
            criteria: "this.user.history['quest.weaponsmith'] && this.user.history['quest.weaponsmith'].indexOf('check') === -1",
            type: 'html',
            html: "\
              <div class='dialog'>\
                <p>Come back when you have more information on weaponsmith!</p>\
              </div>\
            ",
          },
        ],
      },
      {
        id: 'greet2',
        cmd: 'greet',
        criteria: "this.user.history['quest.weaponsmith'] && this.user.history['quest.weaponsmith'].indexOf('check') > -1",
        effects: [
          {
            type: 'html',
            html: "<div class='dialog'>Heh... doesn't surprise me.</div>",
          },
          {
            type: 'html',
            html: "<div class='dialog'>Here, take this:.</div>",
          },
          { type: 'increase:exp', roll: 10, limit: 1 },
          { type: 'give:object.dagger', roll: 1, limit: 1 },
          { type: 'conclude:quest', quest: 'quest.weaponsmith', limit: 1 },
        ],
      },
      {
        id: 'quest',
        cmd: 'ask',
        // criteria: "'weaponsmith'.indexOf(`${this.cmd}`) === 0",
        keywords: ['weaponsmith'],
        effects: [
          { type: 'html', html: '<div class="dialog">Go check on him!</div>' },
          { type: 'begin:quest', quest: 'quest.weaponsmith', limit: 1 },
          { type: 'increase:exp', roll: 10, limit: 1 },
        ],
      },
    ],
  },
};
