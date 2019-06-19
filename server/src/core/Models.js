import { isObjectLike } from 'lodash';
import BaseModel from './BaseModel';

export class User extends BaseModel {
  constructor(get, props) {
    super('user', props, { get });
  }
}

export class Room extends BaseModel {
  constructor(get, props) {
    super('room', props, { get });

    // this.obstacles = async () => {
    //   const obstacles = Object.values(props.exists).filter(exit => isObjectLike(exit));
    //   return Promise.all(obstacles.map(obstacle => get('obstacle', obstacle)))
    //   return Object.values(props.exists).filter(exit => isObjectLike(exit)
    // };

    // this.doors = async () => {
    //   const obstacles = Object.entries(props.exists).filter(([id, exit]) => isObjectLike(exit));
    //   return Promise.all(Object.entries(props.exists).filter(([id, exit]) => isObjectLike(exit)).map(([id, exit]) => get('exit', id))).then();
    // };
  }

  // get(m) {
  //   switch (m) {
  //     default:
  //   }
  // }
}

export class Obstacle extends BaseModel {
  constructor(get, props) {
    super('obstacle', props, { get });
  }
}
