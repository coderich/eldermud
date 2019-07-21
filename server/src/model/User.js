import AbortActionError from '../error/AbortActionError';
import AbortStreamError from '../error/AbortStreamError';
import { getSocket } from '../service/socket.service';
import { writeStream } from '../service/stream.service';
import { breakAttack } from '../service/game.service';
import Describer from '../core/Describer';
import Unit from './Unit';

export default class User extends Unit {
  constructor(...args) {
    super(...args);
    this.isUser = true;
    this.describer = new Describer(this.id, this.getData);
    this.socket = getSocket(this.id);
  }

  emit(type, payload) {
    this.socket.emit(type, payload);
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
      this.setData(this.id, 'hp', 100),
      this.setData(this.id, 'room', 'room.1'),
      this.pullData(this.room, 'units', this.id),
      this.pushData('room.1', 'units', this.id),
    ]);

    const room = await this.getData('room.1');
    const message = await this.describe('room', room);
    this.emit('message', message);
    this.emit('message', { type: 'status', value: { hp: 100 } });
    this.emit('message', { type: 'info', value: 'You have died.' });
    this.broadcastToRoom(this.room, 'message', { type: 'info', value: `${this.name} has died.` });
  }

  async describe(type, ...rest) {
    return { type, value: await this.describer.describe(type, ...rest) };
  }
}
