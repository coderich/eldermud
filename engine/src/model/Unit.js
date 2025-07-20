const Actor = require('./Actor');

module.exports = class Unit extends Actor {
  constructor(data) {
    super(data);
    this.$party = new Set([this]);
    this.$search = new Set();
    this.$invited = new Set();
    this.$effects = new Map();
    this.$partyRank = 1;
  }

  async calcStats() {
    const attrs = ['str', 'int', 'wis', 'con', 'dex', 'cha'];
    const stats = await this.mGet('race', 'class', 'weapon', 'armor', ...attrs);

    if (stats.race && stats.class) {
      const race = CONFIG.get(stats.race);
      const clas = CONFIG.get(stats.class);
      // const player = CONFIG.get('player');
      const levels = await REDIS.lRange(`${this}.levels`, 0, -1);
      this.lvl = levels.length + 1;
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
        this[attr] = stats[attr] = race[attr] + clas[attr] + (this.gains[attr] * (this.lvl - 1));
      });
      levels.forEach((attr) => {
        this[attr] = stats[attr] = this[attr] + 1;
      });
    }

    // Apply dynamic effects (for calculations)
    this.$effects.forEach(({ effect }) => {
      Object.entries(effect).forEach(([key, value]) => {
        if (attrs.includes(key)) this[key] += APP.roll(value);
      });
    });

    // Derived/Calculated stats
    this.hp = this.mhp = (this.lvl * 5) + APP.fibStat(this.con);
    this.ma = this.mma = (this.lvl * 3) + Math.floor((APP.fibStat(this.int) + APP.fibStat(this.wis, 15)) / 2);
    this.ac = this.acc = this.lvl + Math.floor(this.dex / 10);
    this.sc = this.mma; // Spellcasting
    this.dr = Math.floor((this.str / 5)); // Damage Reduction + Poise
    this.mr = Math.floor((this.wis / 5)); // Magic Reduction
    this.enc = 600 + ((this.lvl + this.str) * 20);
    this.crits = Math.floor(this.dex / 10);
    this.dodge = Math.floor(this.dex / 10);
    this.parry = Math.floor(this.dex / 10);
    this.riposte = Math.floor(this.dex / 10);
    this.stealth = Math.floor(this.dex / 10);
    this.traps = Math.floor(this.int / 10);
    this.lockpicks = Math.floor(this.int / 10);
    this.tracking = Math.floor(this.wis / 10);
    this.leadership = Math.floor(this.cha / 10);
    this.perception = this.lvl + this.int + this.dex;
    this.depiction ??= CONFIG.get(`${stats.class}.depiction`);
    this.engageSpeed = 2000 - (this.dex * 10);
    this.moveSpeed = 2000;
    this.dmg = 0;

    // Apply dynamic effects (for bonuses)
    this.$effects.forEach(({ effect }) => {
      Object.entries(effect).forEach(([key, value]) => {
        if (!attrs.includes(key)) this[key] += APP.roll(value);
      });
    });

    return this;
  }
};
