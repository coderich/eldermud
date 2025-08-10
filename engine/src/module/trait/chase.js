const { Action } = require('@coderich/gameflow');

Action.define('chase', [
  async (_, { actor }) => {
    let target;

    const chase = async ({ data, stream }) => {
      const [actorRoom, targetRoom] = [`${actor.room}`, `${target.room}`];
      if (actorRoom === targetRoom) actor.stream(stream.id, 'move', data);
      else target.off('start:move', chase);
    };

    actor.on('post:attack', ({ data }) => {
      target?.off('start:move', chase);
      target = data.target;
      target.on('start:move', chase);
    });
  },
]);
