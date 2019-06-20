import { isObjectLike, flatten } from 'lodash';
import BaseModel from './BaseModel';

// if (Array.isArray(target[m])) return Promise.all(target[m].map(id => get(m.slice(0, 1), id)));

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

  async Obstacles() {
    const obstacles = flatten(Object.values(this.exits).filter(exit => isObjectLike(exit)).map(obstacle => Object.values(obstacle)[0]));
    return Promise.all(obstacles.map(obstacle => this.get('obstacle', obstacle)));
  }

  async Doors() {
    const obstacles = await this.Obstacles();
    return obstacles.filter(obstacle => obstacle.type === 'door');
  }
}

export class Obstacle extends BaseModel {
}

export class Exit extends BaseModel {

}
