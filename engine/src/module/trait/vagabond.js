const { Action, Loop } = require('@coderich/gameflow');

/**
 * Will wander around aimlessly but remain confined to a map/city
 */
Action.define('vagabond', new Loop([
  () => APP.timeout(APP.roll('7d1000+8000')),

  async (_, { actor }) => {
    if (!actor.$target && !actor.$following) {
      const data = await actor.mGet('map', 'room');
      const room = CONFIG.get(data.room);
      const dir = APP.randomElement(Object.keys(room.exits));
      const exit = room.exits[dir];
      const [roomMap] = `${room}`.split('.rooms');
      const [exitMap] = `${exit}`.split('.rooms');
      if (roomMap === exitMap) await actor.stream('action', 'move', dir);
    }
  },
]));
