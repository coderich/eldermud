import { Subject, of, empty } from 'rxjs';
import { tap, concatMap, publish, delay, take, share, retry, catchError } from 'rxjs/operators';
import AbortActionError from '../error/AbortActionError';
import AbortStreamError from '../error/AbortStreamError';

const streams = {};

export const createAction = (...operators) => () => of('action').pipe(
  delay(50),
  ...operators,
  catchError((e) => {
    if (e instanceof AbortActionError) return empty();
    throw e;
  }),
  take(1),
  share(),
);

export const writeStream = (id, action) => {
  if (streams[id]) {
    streams[id].next(action);
  } else {
    streams[id] = new Subject().pipe(
      tap((hook) => {
        if (hook === 'abort') throw new Error('Abort Stream');
      }),
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
