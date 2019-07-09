import Model from './Model';

export default class Being extends Model {
  async move(dir) {
    const room = await this.Room();

    // Check if exit exists
    const exit = await room.Exit(dir) || this.balk('There is no exit in that direction!');

    // Check for obstacles
    const obstacles = await room.Obstacle(dir);
    if (obstacles && !obstacles.some(obstacle => obstacle.resolve())) this.balk('There is an obstacle in your way!');

    // Proceed
    await this.timeout(750);
    this.room = exit.id;
    room.removePlayer(this.id);
    exit.addPlayer(this.id);
    return this.describe('room', exit);
  }

  async grab(target) {
    const room = await this.Room();
    const item = await room.findItem(target, true);
    this.items.push(item.id);
    return this.describe('info', `You took ${item.name}.`);
  }

  async drop(target) {
    const room = await this.Room();
    const item = await this.findItem(target, true);
    room.items.push(item.id);
    return this.describe('info', `You dropped ${item.name}.`);
  }

  async look() {
    const room = await this.Room();
    return this.describe('info', room.description);
  }

  async search() {
    const room = await this.Room();
    const items = await room.search();
    if (!items.length) this.balk('You dont notice anything.');
    this.memory.push(...items);
    return this.describe('info', `You notice: ${await this.describer.describe('items', items)}`);
  }

  async open(dir) {
    const room = await this.Room();
    const door = await room.Door(dir) || this.balk('There is nothing in that direction!');
    return door.open();
  }

  async close(dir) {
    const room = await this.Room();
    const door = await room.Door(dir) || this.balk('There is nothing in that direction!');
    return door.close();
  }

  async lock(dir) {
    const room = await this.Room();
    const door = await room.Door(dir) || this.balk('There is nothing in that direction!');
    return door.close();
  }

  async inventory() {
    const items = await this.Items();
    const description = items.length === 0 ? 'nothing!' : items.map(item => item.name).join(', ');
    return this.describe('info', `You are carrying: ${description}`);
  }

  async Room() {
    return this.get('room', this.room);
  }

  async Items() {
    return Promise.all(this.items.map(item => this.get('item', item)));
  }
}
