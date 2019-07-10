import { of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import Model from './Model';

export default class Being extends Model {
  move(dir) {
    return of('move').pipe(
      mergeMap(async (value) => {
        const room = await this.Room();

        // Check if exit exists
        const exit = await room.Exit(dir) || this.balk('There is no exit in that direction!');

        // Check for obstacles
        const obstacles = await room.Obstacle(dir);
        if (obstacles && !obstacles.some(obstacle => obstacle.resolve())) this.balk('There is an obstacle in your way!');

        // Proceed
        this.room = exit.id;
        return exit;
      }),
      delay(1000),
      mergeMap(exit => this.describe('room', exit)),
    );
  }

  grab(target) {
    return of('grab').pipe(
      mergeMap(async () => {
        const room = await this.Room();
        const item = await room.findItem(target, true);
        this.items.push(item.id);
        return this.describe('info', `You took ${item.name}.`);
      }),
    );
  }

  drop(target) {
    return of('drop').pipe(
      mergeMap(async () => {
        const room = await this.Room();
        const item = await this.findItem(target, true);
        room.items.push(item.id);
        return this.describe('info', `You dropped ${item.name}.`);
      }),
    );
  }

  look() {
    return of('look').pipe(
      mergeMap(async () => {
        const room = await this.Room();
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

  open(dir) {
    return of('open').pipe(
      mergeMap(async () => {
        const room = await this.Room();
        const door = await room.Door(dir) || this.balk('There is nothing in that direction!');
        return door.open();
      }),
    );
  }

  close(dir) {
    return of('close').pipe(
      mergeMap(async () => {
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
}
