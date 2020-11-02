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

/**
 * ActionEmitter
 *
 * Used to emit actions. This wrapper allows interceptors to prevent the action from occuring
 */
export const actionEmitter = new EventEmitter().on('action', async (event, next) => {
  const { type, data } = event;
  await gameEmitter.emit(type, data);
  next();
});
