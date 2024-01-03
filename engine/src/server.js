const { Actor } = require('@coderich/gameflow');
const { Server } = require('@coderich/gameserver');
const Player = require('./model/Player');

const server = new Server({
  telnet: { port: 23, namespace: 'eldermud' },
});

server.on('connect', async ({ socket }) => {
  const player = new Player({ socket });

  player.perform('login').then(async () => {
    Actor[socket.id] = player; // Add them to the list of Actors to respond to (server.on('cmd') below)
    await player.send('cls');
    await player.perform('spawn');
    await player.perform('enter');
  });
});

server.on('disconnect', ({ socket }) => {
  Actor[socket.id]?.perform('logout').then(() => {
    delete Actor[socket.id];
  });
});

server.on('cmd', ({ socket, data }) => {
  return Actor[socket.id]?.perform('translate', data.text).then((command) => {
    return Actor[socket.id]?.stream('input', 'execute', command);
  });
});

module.exports = server;
