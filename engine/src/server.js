const { Actor } = require('@coderich/gameflow');
const { Server } = require('@coderich/gameserver');
const Player = require('./model/Player');

const server = new Server({
  telnet: { port: 23, namespace: 'eldermud' },
});

server.on('connect', async ({ socket }) => {
  const player = new Player({ socket, ...CONFIG.get('player') });
  Actor[socket.id] = player; // Add them to the list of Actors to respond to (server.on('cmd') below)
  await player.send('text', APP.styleText('highlight', 'Welcome Adventurer!'));
  await player.perform('authenticate');
  await player.perform('mainMenu');

  // player.once('post:authenticate', async () => {
  //   player.$authenticated = true;
  //   await player.send('cls');
  //   await player.save(player, true);
  //   await player.perform('spawn');
  //   await player.realm('text', `${APP.styleText(player.type, player.name)} enters the realm.`);
  // });
});

server.on('disconnect', async ({ socket, reason }) => {
  await Actor[socket.id].perform('logout', { reason });
  delete Actor[socket.id];
});

server.on('cmd', async ({ socket, data }) => {
  const player = Actor[socket.id];
  if (player.$authenticated) await Actor[socket.id].perform('cmd', data.text);
});

module.exports = server;
