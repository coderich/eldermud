import { Action, Reducer } from '@coderich/hotrod';
import { objectGroup } from '@coderich/hotrod/util';

const directions = {
  north: 'n',
  south: 's',
  east: 'e',
  west: 'w',
  northeast: 'ne',
  northwest: 'nw',
  southeast: 'se',
  southwest: 'sw',
  up: 'u',
  down: 'd',
};

module.exports = (server, store) => {
  const { actions: storeActions, selectors } = store.info();

  const actions = objectGroup({
    get navigation() { return new Action('navigation'); },
  });

  const reducers = [
    new Reducer(actions.navigation, selectors.players, {
      success: (players, { payload }) => {
      },
    }),
  ];

  storeActions.command.actions.push(new Action('navigation.check', (payload) => {
    const { user, command } = payload;
    const cmd = command.cmd.toLowerCase();
    const room = selectors.room.get(user.room);
    const direction = directions[cmd];
    const doError = (reason) => {
      const err = { ...payload, reason };
      throw err;
    };

    if (direction) {
      if (!room.exits[direction]) doError('No exit in that direction!');
      // if (!room.exits[direction]) return { payload, reason: 'No exit in that dir!', error: true };
      actions.navigation.dispatch({ user, direction });
    }
  }));

  store.loadModule('navigation', { actions, reducers });
};
