import { Selector } from '@coderich/hotrod';
import { objectGroup } from '@coderich/hotrod/util';

const data = require('../../data/realm');

module.exports = (server, store) => {
  const selectors = objectGroup({
    // Sockets...
    get sockets() {
      return new Selector('sockets').map(a => server.sockets.connected).default({});
    },

    get socket() {
      return new Selector(this.sockets).map((sockets, i) => sockets[i]);
    },


    // Clients...
    get clients() {
      return new Selector('clients').default({});
    },

    get client() {
      return new Selector(this.clients).map((clients, i) => clients[i]);
    },


    // Users...
    get users() {
      return new Selector(this.clients).map((clients) => {
        return Object.values(clients).map(client => client.user).reduce((prev, user) => {
          return Object.assign(prev, { [user.id]: user });
        }, {});
      }).default({});
    },

    get user() {
      return new Selector(this.users).map((users, i) => users[i]);
    },


    // Players...
    get players() {
      return new Selector(this.users).map((users) => {
        return Object.entries(users).filter(([key, user]) => user.isLoggedIn).reduce((prev, [key, user]) => {
          return Object.assign(prev, { [key]: user });
        }, {});
      }).default({});
    },

    get player() {
      return new Selector(this.players).map((players, i) => players[i]);
    },


    // Helpers
    get socketByUser() {
      return new Selector(this.clients).map((clients, i) => {
        const { id } = Object.values(clients).find(client => client.user.id === i) || {};
        return selectors.socket.get(id);
      });
    },

    get userBySocket() {
      return new Selector(this.clients).map((clients, i) => clients[i].user);
    },

    get playerBySocket() {
      return new Selector(this.clients).map((clients, i) => {
        const { user } = clients[i];
        if (user.isLoggedIn) return user;
        return undefined;
      });
    },

    get playersByRoom() {
      return new Selector(this.clients).map((clients, i) => {
        const { user } = clients[i];
        if (user.isLoggedIn) return user;
        return undefined;
      });
    },


    // Creatures...
    get creatures() { return new Selector(this.realm).map(realm => realm.creatures).default({}); },
    get creature() { return new Selector(this.creatures).map((creatures, i) => creatures[i]); },

    // NPCs...
    get npcs() { return new Selector(this.realm).map(realm => realm.npcs).default({}); },
    get npc() { return new Selector(this.npcs).map((npcs, i) => npcs[i]); },

    // Rooms...
    get rooms() { return new Selector(this.realm).map(realm => realm.rooms).default({}); },
    get room() { return new Selector(this.rooms).map((rooms, i) => rooms[i]); },

    // Realm...
    get realm() { return new Selector('realm').default(data); },
  });

  store.loadModule('data', { selectors });
};
