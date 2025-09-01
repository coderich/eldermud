const { Action } = require('@coderich/gameflow');

Action.define('say', [
  (input, { actor }) => {
    // const text = APP.styleText('dialog', input);
    const text = input;

    return Promise.all([
      actor.writeln(`${APP.styleText(actor.type, actor.name)}: ${text}`),
      actor.broadcast(`${APP.styleText(actor.type, actor.name)}: ${text}`),
    ]);
  },
]);
