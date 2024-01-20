const Actor = require('./Actor');

module.exports = class Unit extends Actor {
  constructor(data) {
    super(data);
    this.calcStats();
    this.$killers = new Set();
  }

  async calcStats() {
    this.hp = this.mhp = APP.fibStat(this.str) + Math.ceil(APP.fibStat(this.lvl) / 5);
    this.ma = this.mma = APP.fibStat(this.int) + APP.fibStat(this.wis) + Math.ceil(APP.fibStat(this.lvl) / 5);
    this.ac = this.acc = Math.floor(APP.fibStat(this.dex) / 10);
    this.enc = APP.fibStat(this.str);
    this.dr = 0;
    this.mr = 0;
    this.sc = 0;
  }
};
