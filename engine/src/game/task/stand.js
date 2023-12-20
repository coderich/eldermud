const { Action } = require('@coderich/gameflow');

Action.define('task.stand', [
  async (_, { actor }) => {
    const interceptor = ({ promise, data }) => (data.name !== 'stand' ? promise.abort() : null);
    actor.on('pre:execute', interceptor);

    return new Promise((resolve) => {
      actor.once('post:stand', () => {
        actor.off('pre:execute', interceptor);
        resolve();
      });
    });
  },
]);
