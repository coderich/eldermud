const { Actor, Stream } = require('@coderich/gameflow');
const { Server } = require('@coderich/gameserver');

const server = new Server({
  telnet: { port: 23, namespace: 'eldermud' },
});

server.on('connect', async ({ socket }) => {
  const actor = Object.assign(new Actor(socket.id), {
    socket,
    type: 'player',
    streams: ['navigation', 'action', 'default'].reduce((prev, curr) => Object.assign(prev, { [curr]: new Stream(curr) }), {}),
    toString: () => `player.${actor.id}`, // REDIS key
  });

  actor.perform('login').then(async () => {
    Actor[socket.id] = actor; // Add them to the list of Actors to respond to (server.on('cmd') below)
    await socket.emit('cls');
    await actor.perform('spawn');
    await actor.perform('enter');
  });
});

server.on('disconnect', ({ socket }) => {
  Actor[socket.id]?.perform('logout').then(() => {
    delete Actor[socket.id];
  });
});

server.on('cmd', ({ socket, data }) => {
  return Actor[socket.id]?.perform('translate', data).then((command) => {
    return Actor[socket.id]?.perform('execute', command);
  });
});

module.exports = server;
