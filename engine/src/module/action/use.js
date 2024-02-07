const { Action } = require('@coderich/gameflow');

Action.define('use', [
  async ({ target, rest }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    const room = CONFIG.get(await REDIS.get(`${actor}.room`));

    switch (target.type) {
      case 'key': {
        const cmd = await actor.perform('translate', rest.join(' '));
        if (!cmd.tags?.includes('direction')) return abort('You must specify a direction.');
        const door = room.paths?.[cmd.code];
        if (door?.type !== 'door') return abort('There is no door in that direction!');
        if (door.status !== 'locked') return abort('The door is not locked.');
        if (`${door.key.id}` !== `${target.id}`) return abort('You turn the key, but nothing happens.');
        CONFIG.set(`${door}.status`, 'closed');
        return actor.send('text', 'You unlock the door.');
      }
      default: {
        return null;
      }
    }
  },
]);
