import { Action } from '@coderich/hotrod';
import AbortActionError from '../core/AbortActionError';

let i = 1;

const commands = {
  default: ['none'],
  navigation: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest', 'up', 'down'],
  interaction: ['get', 'look', 'open'],
};

const interceptCommand = (command, type, cb) => {
  const { actions } = command;

  const action = new Action(`intercept.${i++}`, async (payload, ...rest) => {
    const { command: { name } } = payload;
    const { meta } = rest[0];

    if (commands[type].indexOf(name) > -1) {
      try {
        await cb(payload, ...rest);
      } catch (e) {
        if (e instanceof AbortActionError) {
          meta.reason = e.message;
          const err = { ...payload };
          throw err;
        } else {
          console.error(e);
        }
      }
    }
  });

  actions.push(action);

  return () => {
    actions.splice(actions.indexOf(action), 1);
  };
};

export { interceptCommand };
