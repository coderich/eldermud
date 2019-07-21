import AbortActionError from '../error/AbortActionError';
import AbortStreamError from '../error/AbortStreamError';
import { addCreature } from '../service/creature.service';
import { toRoom } from '../service/socket.service';
import { writeStream } from '../service/stream.service';
import Unit from './Unit';

export default class Creature extends Unit {
  constructor(...args) {
    super(...args);
    this.isCreature = true;
    this.breakAction = (msg) => { throw new AbortActionError(msg); };
    this.abortAction = (msg) => { throw new AbortActionError(msg); };
    this.abortStream = (msg) => { throw new AbortStreamError(msg); };
    addCreature(this.id);
  }

  async death() {
    writeStream(this.id, 'abort');
    writeStream(`${this.id}.attack`, 'abort');
    await toRoom(this.room, 'message', { type: 'info', value: `The ${this.name} falls to the floor dead.` });
    return Promise.all([
      this.pullData(this.room, 'units', this.id),
      this.delData(this.id),
    ]);
  }
}
