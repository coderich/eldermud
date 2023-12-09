const { Actor, Stream } = require('@coderich/gameflow');
const { Server } = require('@coderich/gameserver');

const server = new Server({
  telnet: { port: 23, namespace: 'eldermud' },
});

server.on('connect', ({ socket }) => {
  Object.assign(Actor.define(socket.id), {
    socket,
    streams: ['navigation'].reduce((prev, curr) => Object.assign(prev, { [curr]: new Stream(curr) }), {}),
    toString: () => `eldermud:${Actor[socket.id].username || Actor[socket.id].id}`,
  }).perform('login').then(() => {
    Actor[socket.id]?.perform('play');
  });
});

server.on('disconnect', ({ socket }) => {
  Actor[socket.id]?.perform('logout').then(() => {
    delete Actor[socket.id];
  });
});

server.on('cmd', ({ socket, data }) => {
  Actor[socket.id]?.perform('translate', data);
});

module.exports = server;
