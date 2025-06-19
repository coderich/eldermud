const { Action } = require('@coderich/gameflow');

Action.define('look', [
  async ({ target, cmd }, { actor, abort }) => {
    if (!target) return abort('There is nothing to see there!');

    switch (target.type) {
      case 'room': {
        if (!cmd) {
          actor.broadcast('text', `${APP.styleText(actor.type, actor.name)} is looking around the room`);
        } else {
          actor.broadcast('text', `${APP.styleText(actor.type, actor.name)} is looking ${APP.direction[cmd.code]}`);
          actor.perimeter('text', `${APP.styleText(actor.type, actor.name)} peeks in from ${APP.theRDirection[cmd.code]}!`);
        }
        return actor.perform('room', target);
      }
      default: {
        actor.send('text', `[${APP.styleText('keyword', target.name)}]`);
        return actor.send('text', target.depiction);
      }
    }
  },
]);
