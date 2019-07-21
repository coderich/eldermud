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
      toRoom(this.room, 'message', { type: 'info', value: `The ${this.name} falls to the floor dead.` }),
    ]);

    // If this creature respawns, update it's template
    if (this.respawn) {
      this.setData(this.template, 'spawn', now + this.roll(this.respawn));
    }

    // Check the spawn room
    const spawnRoom = await this.getData(this.spawnRoom);
    const creatures = await spawnRoom.Creatures();
    const respawnTime = this.roll(spawnRoom.respawn);

    if (!creatures.length) {
      setTimeout(async () => {
        const room = await this.getData(this.spawnRoom);
        const players = await room.Players();
        const respawn = now + respawnTime;
        await this.setData(room.id, 'spawn', respawn);
        room.spawn = respawn;
        if (players.length) room.initialize();
      }, respawnTime);
    }
  }
}
