const Unit = require('./Unit');

module.exports = class Player extends Unit {
  constructor(data) {
    super(data);
    this.type = 'player'; // Because there is no config type for player
    this.toString = () => `player.${this.id}`; // REDIS key
  }

  async getStatus() {
    const status = await this.mGet('hp', 'mhp', 'ma', 'mma', 'exp', 'talents', 'stance');
    const pctHP = (status.hp / status.mhp) * 100;
    const levels = ['status.lowhp', 'status.midhp', 'status.mhp', 'status.mhp'];
    const hpLevel = levels[Math.ceil(pctHP / 33) - 1] || 'status.mhp';
    const maLevel = 'status.mma';

    const talents = Array.from(status.talents.values()).map((talent) => {
      return Object.assign(talent, {
        cooldown: this.$countdowns.has(`${talent}`),
      });
    });

    return { ...status, hpLevel, maLevel, talents };

    // const $talents = talents.map(t => APP.styleText(actor.$countdowns.has(`${t}`) ? 'muted' : 'keyword', t.code)).join(' ✦ ');
    // const effects = Array.from(actor.$effects.values()).filter(el => el.status).map(el => APP.styleText(el.style, CONFIG.get(`app.char.${el.status}`))).filter(Boolean);
    // const $status = [status.stance, ...effects].join(' ');
    // const hp = `${status.hp}`.padStart(`${status.mhp}`.length, '0');
    // const ma = `${status.ma}`.padStart(`${status.mma}`.length, '0');
  }

  async calcPrompt() {
    const sep = ' ';
    const status = await this.getStatus();
    const effects = Array.from(this.$effects.values()).filter(el => el.status).map(el => APP.styleText(el.style, CONFIG.get(`app.char.${el.status}`))).filter(Boolean);
    const $talents = status.talents.map(t => APP.styleText(t.cooldown ? 'muted' : 'keyword', t.code)).join(' ✦ ');
    const $status = [status.stance, ...effects].join(' ');
    const divider = APP.styleText('muted', CONFIG.get('app.char.divider'));

    this.$prompt = [
      '[',
      $status,
      ']',
      sep,
      divider,
      sep,
      APP.styleText(status.hpLevel, CONFIG.get('app.char.health'), status.hp),
      sep,
      APP.styleText(status.maLevel, CONFIG.get('app.char.mana'), status.ma),
      sep,
      APP.styleText('exp', CONFIG.get('app.char.exp'), status.exp),
      sep,
      divider,
      sep,
      $talents,
      sep,
      divider,
      ' ',
      // '[HP=',
      // APP.styleText(status.hpLevel, status.hp),
      // ', MA=',
      // APP.styleText(status.maLevel, status.ma),
      // ']: ',
    ].join('');
    return this.$prompt;
  }
};
