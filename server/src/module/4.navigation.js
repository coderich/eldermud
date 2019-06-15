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

  const navCheckAction = new Action('navigation.check', async (payload, { meta }) => {
    const { user, command } = payload;
    const room = await dao.get('room', user.room);
    const direction = directions[command.cmd];
    const doError = (reason) => {
      meta.reason = reason;
      const err = { ...payload };
      throw err;
    };

    if (direction) {
      if (!room.exits[direction]) doError('No exit in that direction!');
      navigation.actions.addNavigation.dispatch({ user, direction });
    }
  });

  actions.addCommand.actions.push(navCheckAction);
};
