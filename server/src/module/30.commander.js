import { Action } from '@coderich/hotrod';
import { objectGroup } from '@coderich/hotrod/util';
import InterpreterService from '../service/interpreter.service';

module.exports = (server, store) => {
  const { selectors, actions: storeActions } = store.info();

  const actions = objectGroup({
    get command() { return new Action('command'); },
  });

  store.loadModule('commander', { actions });

  const translate = function translate(input) {
    const user = selectors.userBySocket.get(this.id);

    if (user) {
      const command = InterpreterService.translate(input);
      actions.command.dispatch({ user, command });
    }
  };

  // Begin listening to player commands
  storeActions.login.listen({
    success: ({ payload }) => {
      const { id } = payload;
      const socket = selectors.socket.get(id);
      selectors.socketByUser.get(1);

      if (socket) {
        socket.on('message', translate);
      }
    },
  });

  // Stop listening to player commands
  storeActions.logout.listen({
    success: ({ payload }) => {
      const { id } = payload;
      const socket = selectors.socket.get(id);

      if (socket) {
        socket.removeListener('message', translate);
      }
    },
  });

  actions.command.listen({
    success: ({ payload }) => {
      const { user } = payload;
      const socket = selectors.socketByUser.get(user.id);

      if (socket) {
        socket.emit('message', 'ok');
      }
    },
    error: ({ payload }) => {
      const { user, reason } = payload;
      const socket = selectors.socketByUser.get(user.id);

      if (socket) {
        socket.emit('message', reason);
      }
    },
  });
};
