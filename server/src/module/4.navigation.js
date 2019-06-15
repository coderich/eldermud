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
  const { actions } = dao.store.info();
  const navigation = dao.addStoreModel('navigation');

  actions.addCommand.actions.push(new Action('navigation.check', async (payload) => {
    const { user, command } = payload;
    const cmd = command.cmd.toLowerCase();
    const room = await dao.get('room', user.room);
    const direction = directions[cmd];
    const doError = (reason) => {
      const err = { ...payload, reason };
      throw err;
    };

    if (direction) {
      if (!room.exits[direction]) doError('No exit in that direction!');
      navigation.actions.addNavigation.dispatch({ user, direction });
    }
  }));
};
