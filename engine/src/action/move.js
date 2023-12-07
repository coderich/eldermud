const { Action } = require('@coderich/gameflow');

Action.define('move', async (dir, { actor }) => {
  const map = Config.get('data.map.dungeon');
  const { room } = await DB.get(actor.id);
  const exit = map[room]?.exits?.[dir];

  if (exit) {
    await DB.set(actor.id, { room: exit });
    actor.perform('map');
  } else {
    actor.socket.emit('text', 'No exit in that direction!');
  }
});
