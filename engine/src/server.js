const { Actor, Stream } = require('@coderich/gameflow');
const { Server } = require('@coderich/gameserver');

const server = new Server({
  telnet: { port: 23, namespace: 'eldermud' },
});

server.on('connect', ({ socket }) => {
  Object.assign(Actor.define(socket.id), {
    socket,
    type: 'player',
    streams: ['navigation', 'action', 'default'].reduce((prev, curr) => Object.assign(prev, { [curr]: new Stream(curr) }), {}),
    toString: () => `eldermud:player.${Actor[socket.id].name || Actor[socket.id].id}`,
  }).perform('login').then(() => {
    Actor[socket.id]?.perform('spawn');
  });
});

server.on('disconnect', ({ socket }) => {
  Actor[socket.id]?.perform('logout').then(() => {
    delete Actor[socket.id];
  });
});

server.on('cmd', ({ socket, data }) => {
  Actor[socket.id]?.perform('translate', data).then((command) => {
    Actor[socket.id]?.perform('execute', command);
  });
});

module.exports = server;
