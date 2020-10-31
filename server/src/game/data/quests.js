/* eslint-disable no-template-curly-in-string, no-multi-str */
export default {
  'quest.weaponsmith': {
    id: 'quest.weaponsmith',
    triggers: [
      {
        id: 'check',
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
};
