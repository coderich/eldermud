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
    this.emit = () => {};
    this.breakAction = (msg) => { throw new AbortActionError(msg); };
    this.abortAction = (msg) => { throw new AbortActionError(msg); };
    this.abortStream = (msg) => { throw new AbortStreamError(msg); };
    addCreature(this.id);
  }

  async death() {
    const now = new Date().getTime();
    writeStream(this.id, 'abort');
    writeStream(`${this.id}.attack`, 'abort');

    // Remove the creature
    await Promise.all([
      this.pullData(this.room, 'units', this.id),
      this.delData(this.id),
    ]);

    // If this creature respawns, update it's template
    if (this.respawn) {
      this.setData(this.template, 'spawn', now + this.respawn);
    }

    // Check the room
    const room = await this.getData(this.room);

    if (room.respawn) {
      await this.setData(room.id, 'spawn', now + room.respawn);
    }

    toRoom(room, 'message', { type: 'info', value: `The ${this.name} falls to the floor dead.` });
  }
}
