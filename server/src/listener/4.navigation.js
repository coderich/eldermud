import AbortActionError from '../core/AbortActionError';
import { intercept } from '../service/command.service';

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

  // Listen for navigation commands
  intercept(addCommand, 'navigation', async ({ user, command }) => {
    const room = await user.Room();
    const exit = await room.Exit(command.code) || balk('No exit in that direction!');
    const obstacles = await room.Obstacle(command.code);
    if (obstacles && !obstacles.some(resolveObstacle)) balk('There is an obstacle!');
    addNavigation.dispatch({ user, from: room, to: exit });
  });

  // Perform navigation
  addNavigation.listen({
    success: ({ payload: navigation }) => {
      const { user, to } = navigation;
      updateUser.dispatch({ id: user.id, room: to.id });
    },
  });
};
