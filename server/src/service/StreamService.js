import { Subject, of } from 'rxjs';
import { concatMap, publish, catchError } from 'rxjs/operators';

const streams = {};

export const writeStream = (id, actionThunk) => {
  if (streams[id]) {
    streams[id].next(actionThunk);
  } else {
    streams[id] = new Subject().pipe(
      concatMap(thunk => thunk().pipe(
        catchError(e => of(e)),
      )),
      publish(),
    );
    streams[id].connect();
    streams[id].next(actionThunk);
  }
};

export const closeStream = (id) => {
  delete streams[id];
};
