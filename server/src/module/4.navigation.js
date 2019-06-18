import AbortActionError from '../core/AbortActionError';
import { interceptCommand } from '../service/intercepter.service';

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

const resolveObstacle = (obstacle) => {
  switch (obstacle.type) {
    case 'door': return obstacle.state.open;
    default: return false;
  }
};

const balk = (msg) => {
  throw new AbortActionError(msg);
};

module.exports = (server, dao) => {
  const { actions: { addCommand, updateUser } } = dao.store.info();
  const { actions: { addNavigation } } = dao.addStoreModel('navigation');

  interceptCommand(addCommand, 'navigation', async ({ user, command }) => {
    const room = await user.get('room');
    const direction = directions[command.name];
    const exit = room.exits[direction] || balk('No exit in that direction!');
    const [exitId = exit] = Object.keys(exit); // Can be id or object

    // If the exit is an object then there are obstacles
    if (typeof exit === 'object') {
      const obstacles = await Promise.all(exit[exitId].map(id => dao.get('obstacle', id)));
      if (!obstacles.some(resolveObstacle)) balk('There is an obstacle!');
    }

    // Signal move to room
    const toRoom = await dao.get('room', exitId);
    addNavigation.dispatch({ user, from: room, to: toRoom });
  });

  // Perform navigation
  addNavigation.listen({
    success: ({ payload: navigation }) => {
      const { user, to } = navigation;
      user.room = to.id;
      updateUser.dispatch(user);
    },
  });
};
