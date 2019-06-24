import { Action, Selector, Reducer } from '@coderich/hotrod';
// import { objectGroup } from '@coderich/hotrod/util';

module.exports = (mod) => {
  const actions = {
    userNavigate: new Action('user.navigate'),
  };

  const reducers = [
    new Reducer(actions.userNavigate, mod.users, {
      success: (users, { payload }) => {
        const { user, to } = payload;
        users[user.id].room = to;
      },
    }),
  ];

  // Combine & return
  Object.assign(mod.actions, actions);
  mod.reducers.push(...reducers);
  return mod;
};
