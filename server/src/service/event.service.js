import EventEmitter from '../core/EventEmitter';

/**
 * ServerEmitter
 *
 * Used to emit internal server events outside the scope of the actual game
 */
export const serverEmitter = new EventEmitter();

/**
 * GameEmitter
 *
 * Used to emit game events
 */
export const gameEmitter = new EventEmitter();
