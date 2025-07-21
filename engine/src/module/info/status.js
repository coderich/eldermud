const { Action } = require('@coderich/gameflow');

Action.define('status', [
  async (_, { actor }) => {
    const status = await actor.mGet('hp', 'mhp', 'ma', 'mma', 'exp', 'talents', 'posture');
    const sep = '&nbsp;';
    const pctHP = (status.hp / status.mhp) * 100;
    const levels = ['status.lowhp', 'status.midhp', 'status.mhp', 'status.mhp'];
    const level = levels[Math.ceil(pctHP / 33) - 1] || 'status.mhp';
    const talents = Array.from(status.talents.values());
    const cooldowns = await REDIS.mGet(talents.map(t => `${t}.${actor}.cooldown`));
    const $talents = talents.map((t, i) => APP.styleText(cooldowns[i] ? 'muted' : 'keyword', t.code)).join(' - ');
    status.posture += 'ing:';

    // actor.send('status', status);
    actor.send(
      'status',
      '{',
      `${APP.styleText(level, status.hp)} | ${APP.styleText('status.mma', status.ma)}`,
      '}',
      sep,
      '[',
      $talents,
      ']',
      sep,
      `^${APP.styleText('exp', status.exp)}`,
    );
  },
]);
