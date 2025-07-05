const Actor = require('./Actor');

module.exports = class Unit extends Actor {
  constructor(data) {
    super(data);
    this.$party = new Set([this]);
    this.$search = new Set();
    this.$killers = new Set();
    this.$invited = new Set();
    this.$partyRank = 1;
  }

  async calcStats() {
    const attrs = ['str', 'int', 'wis', 'con', 'dex', 'cha'];
    const stats = await this.mGet('lvl', 'race', 'class', ...attrs);

    if (stats.race && stats.class) {
      const race = CONFIG.get(`${stats.race}`);
      const clas = CONFIG.get(`${stats.class}`);
      const player = CONFIG.get('player');
      const levels = await REDIS.lRange(`${this}.levels`, 0, -1);
      this.armor = clas.armor;
      this.weapon = clas.weapon;
      this.attacks = [this.weapon];
      this.traits = player.traits.concat(clas.traits).concat(race.traits);
      this.talents = player.talents.concat(clas.talents).concat(race.talents);
      attrs.forEach((attr) => {
        this[attr] = stats[attr] = race[attr] + clas[attr] + (race.gains[attr] * (stats.lvl - 1)) + (clas.gains[attr] * (stats.lvl - 1));
      });
      levels.forEach((attr) => {
        this[attr] = stats[attr] = this[attr] + 1;
      });
    }

    this.hp = this.mhp = (stats.lvl * 5) + APP.fibStat(stats.con);
    this.ma = this.mma = (stats.lvl * 3) + Math.floor((APP.fibStat(stats.int) + APP.fibStat(stats.wis)) / 2);
    this.ac = this.acc = stats.lvl + Math.floor(stats.dex / 10);
    this.sc = this.mma; // Spellcasting
    this.dr = Math.floor((stats.str / 5)); // Damage Reduction + Poise
    this.mr = Math.floor((stats.wis / 5)); // Magic Reduction
    this.enc = 600 + ((stats.lvl + stats.str) * 20);
    this.crits = Math.floor(stats.dex / 10);
    this.dodge = Math.floor(stats.dex / 10);
    this.parry = Math.floor(stats.dex / 10);
    this.riposte = Math.floor(stats.dex / 10);
    this.stealth = Math.floor(stats.dex / 10);
    this.traps = Math.floor(stats.int / 10);
    this.lockpicks = Math.floor(stats.int / 10);
    this.tracking = Math.floor(stats.wis / 10);
    this.leadership = Math.floor(stats.cha / 10);
    this.perception = stats.lvl + stats.int + stats.dex;
    this.depiction ??= CONFIG.get(`${stats.class}.depiction`);
    return this;
  }
};
