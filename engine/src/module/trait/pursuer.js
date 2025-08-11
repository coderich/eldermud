const { Action } = require('@coderich/gameflow');

Action.define('pursuer', [
  async (_, { actor }) => {
    let target;

    const chase = async ({ data }) => {
      const [actorRoom, targetRoom] = [`${actor.room}`, `${target.room}`];
      if (actorRoom === targetRoom) actor.stream('tactic', 'move', data);
      else target.off('start:move', chase);
    };

    // You're unable to move there so stop chasing...
    actor.on('abort:move', () => {
      target?.off('start:move', chase);
    });

    // Chase the one you're attacking...
    actor.on('post:attack', ({ data }) => {
      target?.off('start:move', chase);
      target = data.target;
      target.on('start:move', chase);
    });
  },
]);
