const { Action } = require('@coderich/gameflow');

Action.define('stun', [
  ({ target, duration }, { actor }) => {
    target.streams.realm.abort();
    target.streams.action.abort();
    target.stream(target.mandatoryStream, new Action('stun', () => APP.timeout(duration)));
    actor.interpolate(APP.styleText('gesture', '{target.name} is stunned!'), { actor, target });
  },
]);
