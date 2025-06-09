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

  calcStats() {
    this.hp = this.mhp = APP.fibStat(this.str) + Math.ceil(APP.fibStat(this.lvl) / 5);
    this.ma = this.mma = APP.fibStat(this.int) + APP.fibStat(this.wis) + Math.ceil(APP.fibStat(this.lvl) / 5);
    this.ac = this.acc = Math.floor(APP.fibStat(this.dex) / 10);
    this.enc = APP.fibStat(this.str);

    this.crits = 0;
    this.dodge = 0;
    this.block = 0; // Damage Reduction
    this.poise = 0;
    this.parry = 0;
    this.riposte = 0;
    this.stealth = 0;

    this.leadership = 0;
    this.perception = 0;
    this.thievery = 0;
    this.traps = 0;
    this.lockpicks = 0;
    this.tracking = 0;

    this.dr = 0; // To be deleted
    this.mr = 0; // Magic Res
    this.sc = 0; // Spellcasting...
  }
};
