const { Actor } = require('@coderich/gameflow');
const { Server } = require('@coderich/gameserver');

const server = new Server({
  telnet: { port: 23, namespace: 'eldermud' },
});

server.on('connect', async ({ socket }) => {
  // Object.assign(Actor.define(socket.id), { socket });

  Object.assign(new Actor(socket.id), { socket }).perform('login').then(async (player) => {
    Actor[socket.id] = player; // Add them to the list of Actors to respond to (server.on('cmd') below)
    await player.send('cls');
    await player.perform('spawn');
  });
});

server.on('disconnect', ({ socket }) => {
  Actor[socket.id]?.perform('logout').then(() => {
    delete Actor[socket.id];
  });
});

server.on('cmd', ({ socket, data }) => {
  return Actor[socket.id]?.perform('translate', data.text).then((command) => {
    return Actor[socket.id]?.stream(command.channel, 'execute', command);
  });
});

module.exports = server;
