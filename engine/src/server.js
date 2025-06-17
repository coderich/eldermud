const { Actor } = require('@coderich/gameflow');
const { Server } = require('@coderich/gameserver');
const Player = require('./model/Player');

const server = new Server({
  telnet: { port: 23, namespace: 'eldermud' },
});

server.on('connect', ({ socket }) => {
  const player = new Player({ socket, ...CONFIG.get('player') });
  player.send('text', APP.styleText('highlight', 'Welcome adventurer!'));
  player.perform('authenticate');
  player.once('post:authenticate', async () => {
    Actor[socket.id] = player; // Add them to the list of Actors to respond to (server.on('cmd') below)
    player.send('cls');
    player.perform('spawn');
  });
});

server.on('disconnect', async ({ socket }) => {
  await Actor[socket.id]?.perform('logout');
  delete Actor[socket.id];
});

server.on('cmd', ({ socket, data }) => {
  return Actor[socket.id]?.perform('cmd', data.text);
});

module.exports = server;
