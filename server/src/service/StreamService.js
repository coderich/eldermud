import { Subject, of, empty } from 'rxjs';
import { concatMap, publish, take, share, catchError } from 'rxjs/operators';
import AbortActionError from '../error/AbortActionError';

const streams = {};

export const abortAction = (msg) => {
  throw new AbortActionError(msg);
};

export const createAction = (...operators) => {
  const stream$ = new Subject().pipe(
    ...operators,
    catchError((e) => {
      if (e instanceof AbortActionError) throw e;
      console.error(e);
      return empty();
    }),
    take(1),
    share(),
  );
  const thunk = () => { stream$.next('go'); return stream$; };
  thunk.listen = (subscriber) => { stream$.subscribe(subscriber); return thunk; };
  return thunk;
};

export const writeStream = (id, action) => {
  if (streams[id]) {
    streams[id].next(action);
  } else {
    streams[id] = new Subject().pipe(
      concatMap(thunk => thunk().pipe(
        catchError(e => of(e)),
      )),
      publish(),
    );
    streams[id].connect();
    streams[id].next(action);
  }
};

export const closeStream = (id) => {
  delete streams[id];
};
