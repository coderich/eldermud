import { Action } from '@coderich/hotrod';
import { objectGroup } from '@coderich/hotrod/util';
import InterpreterService from '../service/interpreter.service';

module.exports = (server, store) => {
  const { selectors: storeSelectors, actions: storeActions } = store.info();

  const actions = objectGroup({
    get command() { return new Action('command'); },
  });

  store.loadModule('commander', { actions });

  const translate = function translate(input) {
    const user = storeSelectors.users.get(this.id);

    if (user) {
      const command = InterpreterService.translate(input);
      actions.command.dispatch({ user, command });
    }
  };

  // Begin listening to player commands
  storeActions.login.listen({
    success: ({ payload }) => {
      const { id } = payload;
      const socket = storeSelectors.socket.get(id);

      if (socket) {
        socket.on('message', translate);
      }
    },
  });

  // Stop listening to player commands
  storeActions.logout.listen({
    success: ({ payload }) => {
      const { id } = payload;
      const socket = storeSelectors.socket.get(id);

      if (socket) {
        socket.removeListener('message', translate);
      }
    },
  });
};
