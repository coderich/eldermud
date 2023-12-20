const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('quest.signup', [
  async (_, { actor }) => {
    await REDIS.set(`${actor}.posture`, 'rest');
    const noop = ({ promise }) => promise.abort();
    actor.on('pre:execute', noop);

    actor.socket.emit('text', '...');
    await Util.timeout(1000);
    actor.socket.emit('text', '... you have trouble opening your eyes');
    await Util.timeout(1000);
    actor.socket.emit('text', '... an unfamiliar voice');
    actor.socket.emit('text', `
      hey... are you ok?
    `);

    actor.off('pre:execute', noop);
    await actor.perform('task.stand');
    actor.socket.emit('text', 'Good. Now to figure this shit out.');
  },
]);
