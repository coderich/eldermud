import { delay, delayWhen } from 'rxjs/operators';
import { Action } from '@coderich/hotrod';
import AbortActionError from '../core/AbortActionError';

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

  const addNavigation = new Action('navigation', async ({ user: shit, command }) => {
    const user = await dao.get('user', shit.id);
    const room = await user.Room();
    const exit = await room.Exit(command.code) || balk('There is no exit in that direction!');
    const obstacles = await room.Obstacle(command.code);
    if (obstacles && !obstacles.some(resolveObstacle)) balk('There is an obstacle in your way!');
    return { user, from: room, to: exit };
  }).weld(
    delay(1000),
  );

  addNavigation.listen({
    success: ({ payload: navigation }) => {
      const { user, to } = navigation;
      updateUser.dispatch({ id: user.id, room: to.id });
    },
  });

  addCommand.listen({
    request: async ({ payload: { user, command } }) => {
      if (command.scope === 'navigation') {
        addCommand.link(delayWhen(() => addNavigation.awaitNextTurn()), addNavigation);
      }
    },
  });

  // addNavigation.pipe(delay(1000));

  // // Listen for navigation commands
  // intercept(addCommand, 'navigation', async ({ user, command }) => {
  //   const room = await user.Room();
  //   const exit = await room.Exit(command.code) || balk('There is no exit in that direction!');
  //   const obstacles = await room.Obstacle(command.code);
  //   if (obstacles && !obstacles.some(resolveObstacle)) balk('There is an obstacle in your way!');
  //   const promise = addNavigation.dispatch({ user, from: room, to: exit }).awaitResponse();
  //   addNavigation.pipe(delayWhen(() => promise));
  //   const unsub = addCommand.pipe(delay(1000));
  //   promise.then(() => unsub());
  // });

  // // Perform navigation
  // addNavigation.listen({
  //   success: ({ payload: navigation }) => {
  //     const { user, to } = navigation;
  //     updateUser.dispatch({ id: user.id, room: to.id });
  //   },
  // });
};
