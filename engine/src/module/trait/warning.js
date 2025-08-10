const { Action } = require('@coderich/gameflow');

Action.define('warning', [
  async (_, { actor, promise }) => {
    const warning = (event) => {
      event.promise.listen(async (step) => {
        if (event.actor.type === 'player' && step === 2 && event.data.target === actor) {
          if (await event.actor.get('warn') !== false) {
            event.abort(`You must ${APP.styleText('highlight', 'set warn false')} to disable warnings!`);
          }
        }
      });
    };

    SYSTEM.on('pre:attack', warning);
    actor.on('post:death', () => SYSTEM.off('pre:attack', warning));
  },
]);
