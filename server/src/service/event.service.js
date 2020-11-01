import EventEmitter from 'events';

class MyEmitter extends EventEmitter {}

export const serverEmitter = new MyEmitter();
export const gameEmitter = new MyEmitter();
