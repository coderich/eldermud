import { tap, delay } from 'rxjs/operators';
import { createAction, writeStream, closeStream } from '../service/stream.service';
import { unsetSocket } from '../service/socket.service';
import { breakAttack } from '../service/game.service';
import Model from '../core/Model';

export default class Unit extends Model {
  constructor(props) {
    props.pronoun = props.pronoun || 'it';
    super(props);
    this.isUnit = true;
  }

  async disconnect() {
    breakAttack(this.id);
    writeStream(this.id, 'abort');
    writeStream(`${this.id}.attack`, 'abort');
    writeStream(`${this.id}.heartbeat`, 'abort');
    closeStream(this.id);
    unsetSocket(this.id);
    const room = await this.getData(this.id, 'room');
    return this.pullData(room, 'units', this.id);
  }

  async stats() {
    return this.noop;
  }

  async status() {
    return this.noop;
  }

  async emit() {
    return this.noop;
  }

  break(value) {
    breakAttack(this.id);
    writeStream(this.id, 'abort');
    writeStream(`${this.id}.attack`, 'abort');
    this.delData(this.id, 'target');
    return this.breakAction(value);
  }

  stun(duration) {
    breakAttack(this.id);
    writeStream(this.id, 'abort');
    writeStream(`${this.id}.attack`, 'abort');
    this.delData(this.id, 'target');
    this.emit('message', { type: 'water', value: 'You are stunned!' });
    writeStream(this.id, createAction(
      delay(duration),
      tap(() => {
        this.emit('message', { type: 'info', value: 'You are no longer stunned.' });
      }),
    ));
  }

  async Room() {
    return this.getData(this.room);
  }

  async Items() {
    return Promise.all(this.items.map(item => this.getData(item)));
  }

  async Equipped() {
    return Promise.all(this.equipped.map(item => this.getData(item)));
  }

  async Talents() {
    return Promise.all(this.talents.map(item => this.getData(item)));
  }

  async Keys() {
    const items = await this.Items();
    const keys = items.filter(item => item.type === 'key');
    if (keys.length) return keys;
    return undefined;
  }

  Quests() {
    return this.getList(this.id, 'quests');
  }
}
