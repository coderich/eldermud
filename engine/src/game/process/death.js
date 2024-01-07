const { Action } = require('@coderich/gameflow');

/**
 * We need an action in order to register death events used in attack and below
 */
Action.define('death', () => null);

SYSTEM.on('post:death', ({ actor }) => {
  switch (actor.type) {
    case 'player': {
      break;
    }
    default: {
      actor.dispose();
      const exp = Math.ceil((actor.mhp * actor.exp) / actor.killers.size);

      actor.killers.forEach((killer) => {
        killer.perform('affect', { exp });
        killer.send('text', `You gain ${APP.styleText('keyword', exp)} soul power.`);
      });

      break;
    }
  }
});
