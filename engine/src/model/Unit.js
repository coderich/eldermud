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
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(attr => (this[attr] = parseInt(this[attr], 10)));
    this.hp = this.mhp = APP.fibStat(this.con) + this.str;
    this.ma = this.mma = Math.floor((APP.fibStat(this.int) + APP.fibStat(this.wis)) / 2);
    this.ac = this.acc = Math.floor(this.dex / 10);
    this.dr = Math.floor((this.str / 5)); // Damage Reduction + Poise
    this.sc = this.mma; // Spellcasting
    this.mr = Math.floor(this.wis + (this.str / 3) + (this.con / 2)); // Magic Reduction/Resist
    this.enc = APP.fibStat(this.str);
    this.perception = this.int + this.dex;
    this.crits = Math.floor(this.dex / 10);
    this.dodge = Math.floor(this.dex / 10);
    this.parry = Math.floor(this.dex / 10);
    this.riposte = Math.floor(this.dex / 10);
    this.stealth = Math.floor(this.dex / 10);
    this.thievery = Math.floor(this.dex / 10);
    this.traps = Math.floor(this.int / 10);
    this.lockpicks = Math.floor(this.int / 10);
    this.tracking = Math.floor(this.wis / 10);
    this.leadership = 0;
  }
};
