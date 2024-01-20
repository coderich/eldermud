const Unit = require('./Unit');

module.exports = class Player extends Unit {
  constructor(data) {
    super(data);
    this.type = 'player';
    this.toString = () => `player.${this.id}`; // REDIS key
  }

  // async calcStats() {
  //   const stats = await this.mGet('str', 'dex', 'int', 'wis', 'lvl');
  //   this.hp = this.mhp = APP.fibStat(stats.str) + Math.ceil(APP.fibStat(stats.lvl) / 5);
  //   this.ma = this.mma = APP.fibStat(stats.int) + APP.fibStat(stats.wis) + Math.ceil(APP.fibStat(stats.lvl) / 5);
  //   this.ac = this.acc = Math.floor(APP.fibStat(stats.dex) / 10);
  //   this.enc = APP.fibStat(stats.str);
  //   this.dr = 0;
  //   this.mr = 0;
  //   this.sc = 0;
  // }
};
