const { Action } = require('@coderich/gameflow');

Action.define('fixture', [
  (_, { actor }) => {
    const handler = ({ data, abort }) => {
      if (data.target === actor) abort('This item is a permanent fixture');
    };

    SYSTEM.on('start:get', handler);
    actor.on('post:destroy', () => SYSTEM.off('start:get', handler));
  },
]);
