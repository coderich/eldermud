import { tap, mergeMap, delayWhen, finalize } from 'rxjs/operators';
import AbortActionError from '../error/AbortActionError';
import AbortStreamError from '../error/AbortStreamError';
import { addAttack, breakAttack, resolveLoop } from '../service/game.service';
import { toRoom } from '../service/socket.service';
import { writeStream, createAction, createLoop } from '../service/stream.service';
import Unit from './Unit';

const preys = new Set();
const deaths = new Set();

export default class Creature extends Unit {
  constructor(...args) {
    super(...args);
    this.isCreature = true;
    this.emit = () => {};
    this.breakAction = (msg) => { throw new AbortActionError(msg); };
    this.abortAction = (msg) => { throw new AbortActionError(msg); };
    this.abortStream = (msg) => { throw new AbortStreamError(msg); };
    this.prey();
  }

  prey() {
    if (!preys.has(this.id) && !deaths.has(this.id)) {
      preys.add(this.id);

      writeStream(this.id, createAction(
        mergeMap(async () => {
          const room = await this.getData(this.room);
          const players = await room.Players();

          if (!players.length) {
            await this.setData(this.id, 'target', null);
            this.break(); // Nothing to fight
          }

          if (players.find(player => player.id === this.target)) this.abortAction(); // In a fight!
        }),
        tap(() => {
          writeStream(`${this.id}.attack`, createLoop(
            mergeMap(async () => {
              const unit = await this.getData(this.id);
              const room = await unit.Room();
              const players = await room.Players();
              const [attack] = Object.values(unit.attacks);

              if (!players.length) {
                await this.setData(this.id, 'target', null);
                this.break(); // Nothing to fight
              }

              if (players.find(player => player.id === unit.target)) {
                addAttack(this.id, unit.target, attack);
              } else {
                const [player] = players;
                await this.setData(this.id, 'target', player.id);
                addAttack(this.id, player.id, attack);
              }
            }),
            delayWhen(() => resolveLoop),
          ));
        }),
        finalize(() => {
          setTimeout(() => { preys.delete(this.id); }, 100);
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
