import { tap, mergeMap, delayWhen, finalize } from 'rxjs/operators';
import AbortActionError from '../error/AbortActionError';
import AbortStreamError from '../error/AbortStreamError';
import { addAttack, breakAttack, getAttack, alertLoop } from '../service/game.service';
import { toRoom } from '../service/socket.service';
import { writeStream, createAction, createLoop } from '../service/stream.service';
import Unit from './Unit';

const models = new Set();
const deaths = new Set();

export default class Creature extends Unit {
  constructor(...args) {
    super(...args);
    this.isCreature = true;
    this.emit = () => {};
    this.breakAction = (msg) => { throw new AbortActionError(msg); };
    this.abortAction = (msg) => { throw new AbortActionError(msg); };
    this.abortStream = (msg) => { throw new AbortStreamError(msg); };

    if (!models.has(this.id)) {
      models.add(this.id);

      writeStream(this.id, createAction(
        mergeMap(async () => {
          const room = await this.getData(this.room);
          const players = await room.Players();
          const currentAttack = getAttack(this.id);

          if (!players.length) this.break(); // Nothing to fight
          if (currentAttack && players.find(player => player.id === currentAttack.targetId)) this.abortAction(); // In a fight!

          // Need a target
          const [player] = players;
          const [attack] = Object.values(this.attacks);
          writeStream(`${this.id}.attack`, createLoop(
            delayWhen(() => alertLoop),
            tap(() => {
              if (deaths.has(this.id)) {
                deaths.delete(this.id);
                this.break();
              } else {
                addAttack(this.id, player.id, attack);
              }
            }),
          ));
        }),
        finalize(() => {
          setTimeout(() => { models.delete(this.id); }, 100);
        }),
      ));
    }
  }

  break() {
    breakAttack(this.id);
    writeStream(this.id, 'abort');
    writeStream(`${this.id}.attack`, 'abort');
    this.abortAction();
  }

  async death() {
    deaths.add(this.id);
    breakAttack(this.id);
    writeStream(this.id, 'abort');
    writeStream(`${this.id}.attack`, 'abort');

    // Remove the creature
    await Promise.all([
      this.pullData(this.room, 'units', this.id),
      this.delData(this.id),
      toRoom(this.room, 'message', { type: 'info', value: `The ${this.name} falls to the floor dead.` }),
    ]);

    const now = new Date().getTime();

    // If this creature respawns, update it's template
    if (this.respawn) this.setData(this.template, 'spawn', now + this.roll(this.respawn));

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
