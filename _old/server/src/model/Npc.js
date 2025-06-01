import Unit from './Unit';

export default class Npc extends Unit {
  constructor(args) {
    super(args);
    this.type = 'npc';
    this.isNPC = true;
    this.hitName = this.name;
    // this.describer = new Describer(this.id, this.getData);
    // this.socket = getSocket(this.id);
  }
}
