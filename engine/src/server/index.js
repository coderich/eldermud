// const Crypto = require('crypto');
const { Actor } = require('@coderich/gameflow');
const { Server, TelnetServer } = require('@coderich/gameserver');
const Player = require('../model/Player');

const { GMCP, ECHO, SGA } = TelnetServer.options;

const server = new Server({
  web: {
    http: { port: 80 },
    routes: require('./routes'),
  },
  telnet: {
    port: 23,
    namespace: 'eldermud',
    localOptions: [GMCP, ECHO, SGA],
    remoteOptions: [GMCP, ECHO, SGA],
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
  await player.listen();
});

server.on('echo', ({ socket, data }) => {
  socket.write(APP.sanitizeEcho(data, socket.buffer));
});

server.on('disconnect', async ({ socket, reason }) => {
  await Actor[socket.id].disconnect(reason);
  await Actor[socket.id].perform('logout', {});
  delete Actor[socket.id];
});

module.exports = server;
