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
    const stats = await this.mGet('str', 'dex', 'con', 'int', 'wis', 'cha', 'class');
    this.hp = this.mhp = APP.fibStat(stats.con) + stats.str;
    this.ma = this.mma = Math.floor((APP.fibStat(stats.int) + APP.fibStat(stats.wis)) / 2);
    this.ac = this.acc = Math.floor(stats.dex / 10);
    this.dr = Math.floor((stats.str / 5)); // Damage Reduction + Poise
    this.sc = this.mma; // Spellcasting
    this.mr = Math.floor(stats.wis + (stats.str / 3) + (stats.con / 2)); // Magic Reduction/Resist
    this.enc = APP.fibStat(stats.str);
    this.perception = stats.int + stats.dex;
    this.crits = Math.floor(stats.dex / 10);
    this.dodge = Math.floor(stats.dex / 10);
    this.parry = Math.floor(stats.dex / 10);
    this.riposte = Math.floor(stats.dex / 10);
    this.stealth = Math.floor(stats.dex / 10);
    this.thievery = Math.floor(stats.dex / 10);
    this.traps = Math.floor(stats.int / 10);
    this.lockpicks = Math.floor(stats.int / 10);
    this.tracking = Math.floor(stats.wis / 10);
    this.leadership = 0;
    return this;
  }
};
