const { Action } = require('@coderich/gameflow');

Action.define('status', [
  async (_, { actor }) => {
    if (actor.type === 'player') {
      const status = await actor.mGet('hp', 'mhp', 'ma', 'mma', 'exp', 'talents', 'stance');
      const pctHP = (status.hp / status.mhp) * 100;
      const levels = ['status.lowhp', 'status.midhp', 'status.mhp', 'status.mhp'];
      const level = levels[Math.ceil(pctHP / 33) - 1] || 'status.mhp';
      const talents = Array.from(status.talents.values());
      const $talents = talents.map(t => APP.styleText(actor.$countdowns.has(`${t}`) ? 'muted' : 'keyword', t.code)).join(' ✦ ');
      const effects = Array.from(actor.$effects.values()).filter(el => el.status).map(el => APP.styleText(el.style, CONFIG.get(`app.char.${el.status}`))).filter(Boolean);
      const $status = [status.stance, ...effects].join(' ');
      const hp = `${status.hp}`.padStart(`${status.mhp}`.length, '0');
      const ma = `${status.ma}`.padStart(`${status.mma}`.length, '0');
      const sep = '&nbsp;';

      actor.send(
        'status',
        '',
        '[',
        $status,
        ']',
        sep,
        APP.styleText('muted', CONFIG.get('app.char.divider')),
        sep,
        APP.styleText(level, CONFIG.get('app.char.health'), hp),
        sep,
        APP.styleText('status.mma', CONFIG.get('app.char.mana'), ma),
        sep,
        APP.styleText('exp', CONFIG.get('app.char.exp'), status.exp),
        sep,
        APP.styleText('muted', CONFIG.get('app.char.divider')),
        sep,
        $talents,
        // sep,
        // APP.styleText('muted', CONFIG.get('app.char.divider')),
        // sep,
        // '{',
        // `${APP.styleText(level, status.hp)} | ${APP.styleText('status.mma', status.ma)}`,
        // '}',
        // sep,
        // '&lt;',
        // '&gt;',
        // sep,
        // '[',
        // $talents,
        // ']',
        // sep,
        // `#${APP.styleText('exp', status.exp)}`,
      );
    }
  },
]);
