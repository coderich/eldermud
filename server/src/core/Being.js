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
    // exit.addPlayer(this.id);
    return this.describe('room', exit);
  }

  async look() {
    const room = await this.Room();
    return this.describe('info', room.description);
  }

  async open(dir) {
    const room = await this.Room();
    const door = await room.Door(dir) || this.balk('There is nothing in that direction!');
    return door.open();
  }

  async inventory() {
    const items = await this.Items();
    const description = items.length === 0 ? 'nothing!' : items.map(item => item.name).join(', ');
    return this.describe('info', `You are carrying: ${description}`);
  }
}
