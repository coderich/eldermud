import { tap, delay, delayWhen } from 'rxjs/operators';
import AbortActionError from '../error/AbortActionError';
import AbortStreamError from '../error/AbortStreamError';
import { getSocket } from '../service/socket.service';
import { writeStream, createAction, createLoop } from '../service/stream.service';
import { breakAttack, attackLoop, healthLoop, tick } from '../service/game.service';
import { tnl, svl } from '../service/util.service';
import { minimap } from '../service/map.service';
import Describer from '../core/Describer';
import Unit from './Unit';

const users = new Set();
const performs = new Set();

export default class User extends Unit {
  constructor(...args) {
    super(...args);
    this.type = 'user';
    this.isUser = true;
    this.hitName = this.name;
    this.describer = new Describer(this.id, this.getData);
    this.socket = getSocket(this.id);
  }

  async connect() {
    await Promise.all([
      this.minimap(),
      this.setData(this.id, 'mhp', svl(this.str)),
      this.setData(this.id, 'mma', svl(this.int)),
    ]);

    await Promise.all([
      this.stats(),
      this.status(),
      this.heartbeat(),
    ]);

    this.emit('message', { type: 'connect' });
  }

  heartbeat() {
    if (!users.has(this.id)) {
      users.add(this.id);

      writeStream(`${this.id}.heartbeat`, createLoop(
        delayWhen(() => healthLoop),
        delay(500), // Allow battle to resolve
        tap(async () => {
          const promises = [];
          const user = await this.getData(this.id);
          const [health, mana] = [Math.ceil(user.mhp * 0.05), Math.ceil(user.mma * 0.05)];
          const [hp, ma] = [Math.min(user.mhp, user.hp + health), Math.min(user.mma, user.ma + mana)];
          if (hp !== user.hp) promises.push(this.setData(this.id, 'hp', hp));
          if (ma !== user.ma) promises.push(this.setData(this.id, 'ma', ma));
          await Promise.all(promises);
          if (promises.length) user.status();
        }),
      ));

      writeStream(`${this.id}.cooldowns`, createLoop(
        delayWhen(() => tick),
        tap(async () => {
          const promises = [];
          const user = await this.getData(this.id);
          Object.entries(user.cooldowns).forEach(([talent, time]) => {
            if (time) promises.push(this.incData(this.id, `cooldowns.${talent}`, -1));
          });
          await Promise.all(promises);
          if (promises.length) user.status();
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

  async perform(action) {
    if (performs.has(this.id)) return this.abortAction('Must wait until next round!');

    writeStream(`${this.id}.perform`, createAction(
      tap(async () => { performs.add(this.id); }),
      delayWhen(() => attackLoop),
      tap(() => performs.delete(this.id)),
    ));

    return action();
  }

  async minimap(fromRoom) {
    const room = fromRoom || await this.Room();
    const value = await minimap(room, 3);
    this.emit('message', { type: 'minimap', value });
  }

  async stats() {
    const user = await this.getData(this.id);
    const equipped = await user.Equipped();

    this.emit('message', {
      type: 'stats',
      value: {
        name: user.name,
        lvl: user.lvl,
        str: user.str,
        agi: user.agi,
        int: user.int,
        ac: 2,
        hp: user.mhp,
        ma: user.mma,
        exp: user.exp,
        talents: user.talents,
        equipped: equipped.reduce((prev, curr) => {
          const attack = curr.attack || {};
          const defense = curr.defense || {};

          return Object.assign(prev, {
            [curr.location]: {
              type: curr.type,
              name: curr.name,
              dmg: attack.dmg,
              prot: defense.prot,
            },
          });
        }, {}),
      },
    });
  }

  async status() {
    const user = await this.getData(this.id);
    // const talents = await this.getList(this.id, 'talents');
    // const cooldowns = Object.entries(user.cooldowns).reduce((prev, [talentId, time]) => {
    //   const talent = talents.find(t => t.id === talentId);
    //   return Object.assign(prev, { [talent.name]: time });
    // }, {});

    this.emit('message', {
      type: 'status',
      value: {
        id: user.id,
        hp: user.hp,
        mhp: user.mhp,
        ma: user.ma,
        mma: user.mma,
        exp: user.exp,
        tnl: tnl(user.lvl),
        cooldowns: user.cooldowns,
      },
    });
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
    writeStream(this.id, 'abort');
    ['attack'].concat(this.talents).forEach(stream => writeStream(`${this.id}.stream`, 'abort'));

    await Promise.all([
      this.setData(this.id, 'exp', Math.ceil(this.exp / 2)),
      this.setData(this.id, 'hp', this.mhp),
      this.setData(this.id, 'ma', this.mma),
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
    this.minimap(room);
  }

  async describe(type, ...rest) {
    return { type, value: await this.describer.describe(type, ...rest) };
  }
}
