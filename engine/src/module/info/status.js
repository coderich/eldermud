const { Action } = require('@coderich/gameflow');

Action.define('status', [
  async (_, { actor }) => {
    const status = await actor.mGet('hp', 'mhp', 'ma', 'mma', 'exp', 'talents', 'posture');
    status.posture += 'ing:';
    const sep = '&nbsp;';
    const pctHP = (status.hp / status.mhp) * 100;
    const levels = ['status.lowhp', 'status.midhp', 'status.mhp', 'status.mhp'];
    const level = levels[Math.ceil(pctHP / 33) - 1] || 'status.mhp';
    const talents = Array.from(status.talents.values()).map(t => APP.styleText('keyword', t.code));

    // actor.send('status', status);
    actor.send(
      'status',
      // APP.styleText('engaged', APP.ucFirst(status.posture)),
      // sep,
      '{',
      `${APP.styleText(level, status.hp)} | ${APP.styleText('status.mma', status.ma)}`,
      '}',
      sep,
      // `- ${APP.styleText('engaged', status.posture)} -`,
      // sep,
      '[',
      talents.join(' - '),
      ']',
      sep,
      `^${APP.styleText('exp', status.exp)}`,
    );
  },
]);
