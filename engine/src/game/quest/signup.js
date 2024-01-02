const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('quest.signup', [
  async (_, { actor }) => {
    await REDIS.set(`${actor}.posture`, 'rest');
    const noop = ({ promise }) => promise.abort();
    actor.on('pre:execute', noop);

    actor.send('text', '...');
    await Util.timeout(1000);
    actor.send('text', '... you have trouble opening your eyes');
    await Util.timeout(1000);
    actor.send('text', '... an unfamiliar voice');
    actor.send('text', `
      hey... are you ok?
    `);

    actor.off('pre:execute', noop);
    await actor.perform('task.stand');
    actor.send('text', 'Good. Now to figure this shit out.');
  },
]);
