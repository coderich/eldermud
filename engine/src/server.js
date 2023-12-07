const { Actor } = require('@coderich/gameflow');
const { Server } = require('@coderich/gameserver');

const server = new Server({
  telnet: { port: 23, namespace: 'eldermud' },
});

server.on('connect', ({ socket }) => {
  console.log(socket.id, 'has connected');
  Object.assign(Actor.define(socket.id), { socket }).perform('login');
});

server.on('cmd', ({ socket, data }) => {
  Actor[socket.id]?.perform('translate', data);
});

server.on('disconnect', ({ socket }) => {
  console.log(socket.id, 'has disconnected');
  delete Actor[socket.id];
});

module.exports = server;
