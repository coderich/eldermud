import { Action } from '@coderich/hotrod';

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

module.exports = (server, dao) => {
  const { actions: { addCommand, updateUser } } = dao.store.info();
  const { actions: { addNavigation } } = dao.addStoreModel('navigation');

  // Listen for navigation commands from user
  const navCheckAction = new Action('navigation.check', async (payload, { meta }) => {
    const { user, command } = payload;
    const room = await user.get('room');
    const direction = directions[command.cmd];
    const doError = (reason) => {
      meta.reason = reason;
      const err = { ...payload };
      throw err;
    };

    if (direction) {
      const toRoomId = room.exits[direction];
      if (!toRoomId) doError('No exit in that direction!');

      const toRoom = await dao.get('room', toRoomId);
      addNavigation.dispatch({ user, from: room, to: toRoom });
    }
  });

  addCommand.actions.push(navCheckAction);

  // Perform navigation
  addNavigation.listen({
    success: ({ payload: navigation }) => {
      const { user, to } = navigation;
      user.room = to.id;
      updateUser.dispatch(user);
    },
  });
};
