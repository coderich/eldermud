const Actor = require('./Actor');

module.exports = class Unit extends Actor {
  constructor(data) {
    super(data);
    this.$party = new Set([this]);
    this.$search = new Set();
    this.$killers = new Set();
    this.$invited = new Set();
    this.$effects = new Map();
    this.$partyRank = 1;
  }

  async calcStats() {
    const attrs = ['str', 'int', 'wis', 'con', 'dex', 'cha'];
    const stats = await this.mGet('lvl', 'race', 'class', 'weapon', 'armor', ...attrs);

    if (stats.race && stats.class) {
      const race = CONFIG.get(stats.race);
      const clas = CONFIG.get(stats.class);
      // const player = CONFIG.get('player');
      const levels = await REDIS.lRange(`${this}.levels`, 0, -1);
      this.armor = CONFIG.get(stats.armor);
      this.weapon = CONFIG.get(stats.weapon);
      this.attacks = [this.weapon];
      this.traits = await REDIS.sMembers(`${this}.traits`).then(arr => new Set(arr.map(t => CONFIG.get(t))));
      this.talents = await REDIS.sMembers(`${this}.talents`).then(arr => new Set(arr.map(t => CONFIG.get(t))));
      this.gains = Object.entries(race.gains).reduce((prev, [key, value]) => {
        prev[key] += value;
        return prev;
      }, { ...clas.gains });
      attrs.forEach((attr) => {
        this[attr] = stats[attr] = race[attr] + clas[attr] + (this.gains[attr] * (stats.lvl - 1));
      });
      levels.forEach((attr) => {
        this[attr] = stats[attr] = this[attr] + 1;
      });
    }

    // Apply dynamic effects
    this.$effects.forEach((affect) => {
      Object.entries(affect).forEach(([key, value]) => {
        this[key] += value;
      });
    });

    this.hp = this.mhp = (stats.lvl * 5) + APP.fibStat(this.con);
    this.ma = this.mma = (stats.lvl * 3) + Math.floor((APP.fibStat(this.int) + APP.fibStat(this.wis, 15)) / 2);
    this.ac = this.acc = stats.lvl + Math.floor(this.dex / 10);
    this.sc = this.mma; // Spellcasting
    this.dr = Math.floor((this.str / 5)); // Damage Reduction + Poise
    this.mr = Math.floor((this.wis / 5)); // Magic Reduction
    this.enc = 600 + ((stats.lvl + this.str) * 20);
    this.crits = Math.floor(this.dex / 10);
    this.dodge = Math.floor(this.dex / 10);
    this.parry = Math.floor(this.dex / 10);
    this.riposte = Math.floor(this.dex / 10);
    this.stealth = Math.floor(this.dex / 10);
    this.traps = Math.floor(this.int / 10);
    this.lockpicks = Math.floor(this.int / 10);
    this.tracking = Math.floor(this.wis / 10);
    this.leadership = Math.floor(this.cha / 10);
    this.perception = stats.lvl + this.int + this.dex;
    this.depiction ??= CONFIG.get(`${stats.class}.depiction`);

    // Speeds
    this.moveSpeed = 2000;
    this.engageSpeed = 2000 - (this.dex * 10);
    return this;
  }
};
