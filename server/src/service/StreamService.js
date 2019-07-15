import { Subject, of } from 'rxjs';
import { concatMap, publish, take, share, catchError } from 'rxjs/operators';

const streams = {};

// export const createAction = (stream) => {
//   const stream$ = stream.pipe(take(1), share());
//   const thunk = () => stream$;
//   thunk.listen = (subscriber) => { stream$.subscribe(subscriber); return thunk; };
//   return thunk;
// };

export const createAction = (...operators) => {
  const stream$ = new Subject().pipe(...operators, take(1), share());
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
