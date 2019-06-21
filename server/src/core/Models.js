import { isObjectLike, flatten } from 'lodash';
import AbortActionError from './AbortActionError';
import BaseModel from './BaseModel';

export class User extends BaseModel {
  async Room() {
    return this.get('room', this.room);
  }
}


export class Room extends BaseModel {
  async Exit(dir) {
    const exit = this.exits[dir];
    if (!exit) return undefined;

    const [roomId = exit] = Object.keys(exit);
    return this.get('room', roomId);
  }

  async Exits() {
    return Promise.all(Object.values(this.exits).map((exit) => {
      const [roomId = exit] = Object.keys(exit);
      return this.get('room', roomId);
    }));
  }

  async Obstacle(dir) {
    const exit = this.exits[dir];
    if (!exit) return undefined;
    if (!isObjectLike(exit)) return undefined;

    const [obstacles] = Object.values(exit);
    return Promise.all(obstacles.map(obstacle => this.get('obstacle', obstacle)));
  }

  async Obstacles() {
    const obstacles = flatten(Object.values(this.exits).filter(exit => isObjectLike(exit)).map(obstacle => Object.values(obstacle)[0]));
    return Promise.all(obstacles.map(obstacle => this.get('obstacle', obstacle)));
  }

  async Door(dir) {
    const obstacles = await this.Obstacle(dir);
    if (!obstacles) return undefined;
    return obstacles.filter(obstacle => obstacle.type === 'door')[0];
  }

  async Doors() {
    const obstacles = await this.Obstacles();
    return obstacles.filter(obstacle => obstacle.type === 'door');
  }
}


export class Obstacle extends BaseModel {
  async Open() {
    if (this.state.open) throw new AbortActionError('Door already open!');
    const { actions: { updateObstacle } } = this.store.info();
    this.state.open = true;
    updateObstacle.dispatch(this);
  }

  async Close() {
    if (!this.state.open) throw new AbortActionError('Door already closed!');
    this.state.open = false;
    const { actions: { updateObstacle } } = this.store.info();
    updateObstacle.dispatch(this);
  }
}


export class Exit extends BaseModel {
}
