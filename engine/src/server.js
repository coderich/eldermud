const { Actor } = require('@coderich/gameflow');
const { Server } = require('@coderich/gameserver');
const Player = require('./model/Player');

const server = new Server({
  telnet: { port: 23, namespace: 'eldermud' },
});

server.on('connect', async ({ socket }) => {
  const player = Actor[socket.id] = new Player({ socket, ...CONFIG.get('player') });
  await player.send('text', APP.styleText('highlight', 'Welcome Adventurer!'));
  await player.perform('authenticate');
  await player.perform('mainMenu');
  player.$ready$ = true;
});

server.on('disconnect', async ({ socket, reason }) => {
  await Actor[socket.id].disconnect(reason);
  delete Actor[socket.id];
});

server.on('cmd', async ({ socket, data }) => {
  const player = Actor[socket.id];
  if (player.$ready$) await Actor[socket.id].perform('cmd', data.text);
});

module.exports = server;
