import { writeStream, closeStream } from '../service/stream.service';
import { unsetSocket } from '../service/socket.service';
import { breakAttack } from '../service/game.service';
import Model from '../core/Model';

export default class Unit extends Model {
  constructor(...args) {
    super(...args);
    this.isUnit = true;
    this.timeout = ms => new Promise(res => setTimeout(res, ms));
  }

  async disconnect() {
    breakAttack(this.id);
    writeStream(this.id, 'abort');
    writeStream(`${this.id}.attack`, 'abort');
    writeStream(`${this.id}.heartbeat`, 'abort');
    closeStream(this.id);
    unsetSocket(this.id);
    const room = await this.getData(this.id, 'room');
    this.pullData(room, 'units', this.id);
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

  async Room() {
    return this.getData(this.room);
  }

  async Items() {
    return Promise.all(this.items.map(item => this.getData(item)));
  }

  async Keys() {
    const items = await this.Items();
    const keys = items.filter(item => item.type === 'key');
    if (keys.length) return keys;
    return undefined;
  }
}
