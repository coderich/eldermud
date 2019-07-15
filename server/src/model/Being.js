import { of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { translate } from '../service/CommandService';
import { getData } from '../service/DataService';
import Model from '../core/Model';

export default class Being extends Model {
  constructor(...args) {
    super(...args);
    this.memory = [];
    this.items = this.items || [];
  }

  say(phrase) {
    return of('say').pipe(
      mergeMap(async () => {
        const room = await this.Room();
        this.emit('say', { being: this, room, phrase });
        return this.describe('info', `You say "${phrase}"`);
      }),
    );
  }

  move(dir) {
    return of('move').pipe(
      mergeMap(async () => {
        const room = await this.Room();

        // Check if exit exists
        const exit = await room.Exit(dir) || this.balk('There is no exit in that direction!');

        // Check for obstacles
        const obstacles = await room.Obstacle(dir);
        if (obstacles && !obstacles.some(obstacle => obstacle.resolve())) this.balk('There is an obstacle in your way!');

        // Proceed
        return { from: room, to: exit };
      }),
      delay(1000),
      mergeMap(({ from, to }) => {
        this.room = to.id;
        this.emit('move', { being: this, from, to });
        return this.describe('room', to);
      }),
    );
  }

  get(target) {
    return of('get').pipe(
      mergeMap(async () => {
        const room = await this.Room();
        const locatedItem = await room.findItem(target);
        const item = room.takeItem(locatedItem);
        return item;
      }),
      mergeMap((item) => {
        this.items.push(item.id);
        this.emit('get', { being: this, item });
        return this.describe('info', `You took ${item.name}.`);
      }),
    );
  }

  drop(target) {
    return of('drop').pipe(
      mergeMap(async () => {
        const room = await this.Room();
        const item = await this.findItem(target, true);
        return { room, item };
      }),
      mergeMap(({ room, item }) => {
        room.items.push(item.id);
        return this.describe('info', `You dropped ${item.name}.`);
      }),
    );
  }

  look(target) {
    return of('look').pipe(
      mergeMap(async () => {
        const room = await this.Room();

        if (target) {
          const { code: dir } = translate(target);
          const exit = await room.Exit(dir) || this.balk('There is nothing in that direction!');
          return this.describe('room', exit);
        }

        return this.describe('info', room.description);
      }),
    );
  }

  search() {
    return of('search').pipe(
      mergeMap(async () => {
        const room = await this.Room();
        const items = await room.search();
        if (!items.length) this.balk('You dont notice anything.');
        this.memory.push(...items);
        return this.describe('info', `You notice: ${await this.describer.describe('items', items)}`);
      }),
    );
  }

  open(target) {
    return of('open').pipe(
      mergeMap(async () => {
        const { code: dir } = translate(target);
        const room = await this.Room();
        const door = await room.Door(dir) || this.balk('There is nothing in that direction!');
        return door.open();
      }),
    );
  }

  close(target) {
    return of('close').pipe(
      mergeMap(async () => {
        const { code: dir } = translate(target);
        const room = await this.Room();
        const door = await room.Door(dir) || this.balk('There is nothing in that direction!');
        return door.close();
      }),
    );
  }

  lock(dir) {
    return of('lock').pipe(
      mergeMap(async () => {
        const room = await this.Room();
        const door = await room.Door(dir) || this.balk('There is nothing in that direction!');
        return door.close();
      }),
    );
  }

  inventory() {
    return of('inventory').pipe(
      mergeMap(async () => {
        const items = await this.Items();
        const description = items.length === 0 ? 'nothing!' : items.map(item => item.name).join(', ');
        return this.describe('info', `You are carrying: ${description}`);
      }),
    );
  }

  use(command, dir) {
    return of('use').pipe(
      mergeMap(async () => {
        if (dir.scope === 'navigation') {
          const target = command.args.slice(0, -1).join(' ');
          const item = await this.findItem(target);
          const room = await this.Room();
          const door = await room.Door(dir.code) || this.balk('There is nothing in that direction!');
          return item.use(door);
        }

        const target = command.args.join(' ');
        const item = await this.findItem(target);
        return item.use();
      }),
    );
  }

  async Room() {
    return getData(this.room);
  }

  async Items() {
    return Promise.all(this.items.map(item => getData(item)));
  }
}
