import { tap, delay, delayWhen } from 'rxjs/operators';
import AbortActionError from '../error/AbortActionError';
import AbortStreamError from '../error/AbortStreamError';
import { getSocket } from '../service/socket.service';
import { writeStream, createLoop } from '../service/stream.service';
import { breakAttack, healthLoop } from '../service/game.service';
import { minimap } from '../service/map.service';
import Describer from '../core/Describer';
import Unit from './Unit';

const users = new Set();

export default class User extends Unit {
  constructor(...args) {
    super(...args);
    this.isUser = true;
    this.hitName = this.name;
    this.describer = new Describer(this.id, this.getData);
    this.socket = getSocket(this.id);
  }

  connect() {
    if (!users.has(this.id)) {
      users.add(this.id);

      writeStream(`${this.id}.heartbeat`, createLoop(
        delayWhen(() => healthLoop),
        delay(500), // Allow battle to resolve
        tap(async () => {
          const user = await this.getData(this.id);
          const beat = Math.floor(user.mhp * 0.05);
          const hp = Math.min(user.mhp, user.hp + beat);
          if (hp !== user.hp) {
            await this.setData(this.id, 'hp', hp);
            user.status();
          }
        }),
      ));
    }
  }

  async disconnect() {
    users.delete(this.id);
    return super.disconnect();
  }

  emit(type, payload) {
    this.socket.emit(type, payload);
  }

  async minimap(fromRoom) {
    const room = fromRoom || await this.Room();
    const value = await minimap(room, 2);
    this.emit('message', { type: 'minimap', value });
  }

  async status() {
    const user = await this.getData(this.id);
    this.emit('message', { type: 'status', value: { hp: user.hp, exp: user.exp } });
  }

  async broadcastToRoom(roomId, type, payload) {
    const room = await this.getData(roomId);
    const units = (await room.Players()).filter(unit => unit.id !== this.id);
    units.forEach(unit => unit.emit(type, payload));
  }

  breakAction(value) {
    if (value) this.emit('message', { type: 'info', value });
    throw new AbortActionError(value);
  }

  abortAction(value) {
    if (value) this.emit('message', { type: 'error', value });
    throw new AbortActionError(value);
  }

  abortStream(value) {
    if (value) this.emit('message', { type: 'error', value });
    throw new AbortStreamError(value);
  }

  async death() {
    breakAttack(this.id);
    writeStream(`${this.id}.attack`, 'abort');
    writeStream(this.id, 'abort');

    await Promise.all([
      this.setData(this.id, 'hp', this.mhp),
      this.setData(this.id, 'room', 'room.1'),
      this.pullData(this.room, 'units', this.id),
      this.pushData('room.1', 'units', this.id),
    ]);

    const room = await this.getData('room.1');
    const message = await this.describe('room', room);
    this.emit('message', message);
    this.emit('message', { type: 'info', value: 'You have died.' });
    this.broadcastToRoom(this.room, 'message', { type: 'info', value: `${this.name} has died.` });
    this.status();
  }

  async describe(type, ...rest) {
    return { type, value: await this.describer.describe(type, ...rest) };
  }
}
