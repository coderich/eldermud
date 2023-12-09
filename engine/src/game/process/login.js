const { Action } = require('@coderich/gameflow');

const { map, room } = CONFIG.get('action.login');

Action.define('login', (data, { actor }) => {
  return actor.socket.query('login', data).then(({ username, password, option }) => {
    switch (option) {
      case 'guest': {
        return REDIS.mSet({
          [`${actor}.room`]: room,
          [`${actor}.map`]: map,
        }).then(() => Object.assign(actor, { username: actor.id }));
      }
      // case 'signup': {
      //   return DB.get(username).then((profile) => {
      //     if (profile) return actor.perform('login', 'username exists');
      //     return DB.set(username, { ...newProfile, username, password }).then(() => Object.assign(actor, { username }));
      //   });
      // }
      // case 'claim': {
      //   return DB.get(username).then((profile) => {
      //     if (profile) return actor.perform('login', 'username exists');
      //     return DB.get(actor.username).then((transfer) => {
      //       return Promise.all([
      //         DB.del(actor.username),
      //         DB.set(username, { ...transfer, username, password }),
      //       ]).then(() => Object.assign(actor, { username }));
      //     });
      //   });
      // }
      default: {
        return null;
        // return DB.get(username).then((profile) => {
        //   return profile?.password === password ? Object.assign(actor, { username }) : actor.perform('login', 'invalid password');
        // });
      }
    }
  });
});
