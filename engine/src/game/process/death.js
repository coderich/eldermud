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
      break;
    }
  }
});
