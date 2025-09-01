// const Crypto = require('crypto');
const { Actor } = require('@coderich/gameflow');
const { Server } = require('@coderich/gameserver');
const Player = require('../model/Player');

const server = new Server({
  web: {
    http: { port: 80 },
    routes: require('./routes'),
  },
  telnet: {
    port: 23,
    namespace: 'eldermud',
  },
});

server.on('connect', async ({ socket }) => {
  const player = Actor[socket.id] = new Player({ socket, ...CONFIG.get('player') });

  // await socket.gmcp('Client', 'GUI', {
  //   version: Crypto.randomUUID(),
  //   url: 'http://localhost/mudlet/ui/version/eldermud.mpackage',
  // });

  // await player.send('cls');
  await player.writeln(APP.styleText('highlight', 'Welcome Adventurer!'));
  await player.perform('authenticate');
  await player.perform('mainMenu');
  player.$ready$ = true;
});

server.on('disconnect', async ({ socket, reason }) => {
  await Actor[socket.id].disconnect(reason);
  await Actor[socket.id].perform('logout', {});
  delete Actor[socket.id];
});

server.on('data', async ({ socket, data }) => {
  const player = Actor[socket.id];
  if (player.$ready$) await Actor[socket.id].perform('cmd', data);
});

module.exports = server;
