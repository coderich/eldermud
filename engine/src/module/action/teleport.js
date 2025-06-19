const { Action } = require('@coderich/gameflow');

Action.define('teleport', [
  async ({ room }, { actor }) => {
    const exit = CONFIG.get(await actor.get('room'));
    room.units.add(actor);
    exit.units.delete(actor);
    await actor.save({ room });
    await actor.send('cls');
    await actor.perform('map');
    await actor.perform('room');
    return { room, exit, target: room };
  },
]);
