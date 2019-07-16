import AbortActionError from '../error/AbortActionError';
import { getSocket } from '../service/socket.service';
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

  async broadcast(room, type, payload) {
    const units = (await room.Units()).filter(unit => unit.isUser && unit.id !== this.id);
    units.forEach(unit => unit.emit(type, payload));
  }

  abortAction(value) {
    this.emit('message', { type: 'error', value });
    throw new AbortActionError(value);
  }

  async describe(type, obj) {
    return { type, value: await this.describer.describe(type, obj) };
  }
}
