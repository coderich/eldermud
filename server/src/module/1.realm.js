import { Selector } from '@coderich/hotrod';
import { objectGroup } from '@coderich/hotrod/util';

const data = require('../../data/realm');

module.exports = (server, store) => {
  const { selectors: storeSelectors, actions: storeActions } = store.info();

  const selectors = objectGroup({
    get realm() { return new Selector('realm').default(data); },

    get room() { return new Selector(this.rooms).map((rooms, i) => rooms[i]); },
    get rooms() { return new Selector(this.realm).map(realm => realm.rooms).default({}); },

    get npc() { return new Selector(this.npcs).map((npcs, i) => npcs[i]); },
    get npcs() { return new Selector(this.realm).map(realm => realm.npcs).default({}); },

    get creature() { return new Selector(this.creatures).map((creatures, i) => creatures[i]); },
    get creatures() { return new Selector(this.realm).map(realm => realm.creatures).default({}); },

    get player() { return new Selector(this.players).map((players, i) => players[i]); },
    get players() {
      return new Selector(storeSelectors.users).map((users) => {
        return Object.entries(users).filter(([key, user]) => user.isLoggedIn).reduce((prev, [key, user]) => {
          return Object.assign(prev, { [key]: user });
        }, {});
      }).default({});
    },
  });

  storeActions.login.listen({
    success: ({ payload }) => {
      const { id, user } = payload;
      const socket = storeSelectors.socket.get(id);
      const room = selectors.room.get(user.room);

      if (socket) {
        socket.emit('message', room);
      }
    },
  });

  storeActions.disconnect.listen({
    request: ({ payload }) => {
      const { id } = payload;
      const client = storeSelectors.client.get(id);

      if (client.user) {
        const player = selectors.player.get(client.user.id);

        if (player) {
          console.log('You are in big trouble');
        }
      }
    },
  });

  store.loadModule('realm', { selectors });
};
