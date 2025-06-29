const { Action } = require('@coderich/gameflow');

Action.define('banding', (_, context) => {
  const invited = ({ actor }) => {
    if (context.actor.type === actor.type) {
      // console.log(`${context.actor} is trying to follow ${actor}`);
      context.actor.perform('follow', { target: actor });
    }
  };

  context.actor.on('unitEntered', ({ actor }) => {
    if (context.actor.type === actor.type) {
      // console.log(`${actor} has entered the room of ${context.actor}`);
      context.actor.perform('invite', { target: actor });
    }
  });

  SYSTEM.on(`invite:${context.actor}`, invited);
  context.actor.once('post:destroy', () => SYSTEM.off(`invite:${context.actor}`, invited));
});
