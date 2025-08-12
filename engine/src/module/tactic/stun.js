const { Action } = require('@coderich/gameflow');

Action.define('stun', [
  ({ target, duration }, { actor }) => {
    target.abortAllStreams();
    target.stream(target.mandatoryStream, new Action('stun', () => APP.timeout(duration)));
    actor.interpolate(APP.styleText('gesture', '{actor.name} {stun} {target.name}!'), { actor, target });
  },
]);
