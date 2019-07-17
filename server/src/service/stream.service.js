import { Subject, of, empty } from 'rxjs';
import { concatMap, publish, delay, take, share, retry, catchError } from 'rxjs/operators';
import AbortActionError from '../error/AbortActionError';
import AbortStreamError from '../error/AbortStreamError';

const streams = {};

export const createAction = (...operators) => {
  const stream$ = new Subject().pipe(
    delay(50), // All actions take time and ensures that notices are sent before new actions
    ...operators,
    catchError((e) => {
      if (e instanceof AbortActionError) return empty();
      throw e;
    }),
    take(1),
    share(),
  );

  const thunk = () => {
    stream$.next('go');
    return stream$;
  };

  thunk.listen = (subscriber) => {
    if (!subscriber.error) subscriber.error = () => {};
    stream$.subscribe(subscriber);
    return thunk;
  };

  return thunk;
};

export const createActionLoop = (...operators) => {

};

export const writeStream = (id, action) => {
  if (streams[id]) {
    streams[id].next(action);
  } else {
    streams[id] = new Subject().pipe(
      concatMap(thunk => thunk().pipe(
        catchError((e) => {
          if (e instanceof AbortStreamError) throw e;
          return of(e);
        }),
      )),
      retry(),
      publish(),
    );
    streams[id].connect();
    streams[id].next(action);
  }
};

export const closeStream = (id) => {
  delete streams[id];
};
