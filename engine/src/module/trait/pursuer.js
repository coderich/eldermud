const { Action } = require('@coderich/gameflow');

Action.define('pursuer', [
  async (_, { actor, stream }) => {
    let target;

    //
    const chase = ({ data }) => {
      actor.stream('action', 'move', data); // Tactic stream respects mandatoryStream
    };

    const giveup = () => {
      target?.off('start:move', chase);
      actor.off('abort:move', giveup);
    };

    actor.on('abort:move', giveup);
    stream.once('abort', giveup);

    // Chase the one you're attacking...
    actor.on('start:attack', ({ data }) => {
      if (data.target !== target) {
        target?.off('start:move', chase);
        target = data.target;
        target.on('start:move', chase);
      }
    });
  },
]);
