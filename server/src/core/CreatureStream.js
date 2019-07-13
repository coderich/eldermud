import { Subject, of } from 'rxjs';
import { tap, mergeMap, concatMap, catchError, retry, publish } from 'rxjs/operators';
import AbortActionError from './AbortActionError';

export default class CreatureStream {
  constructor(creature) {
    const stream = new Subject().pipe(
      mergeMap(async ({ type, payload }) => {
        const room = await creature.Room();

        switch (type) {
          case 'move': {
            const { being, to } = payload;

            if (room.id === to.id) {
              await creature.timeout(1000); // Reflexes/Awareness
              return creature.scan();
            }

            return creature.follow(being);
          }
          case 'scan': {
            return creature.scan();
          }
          default: {
            return 'idk';
          }
        }
      }),
      concatMap(action => action.pipe(
        catchError((e) => {
          if (e instanceof AbortActionError) return of({ type: 'error', value: e.message });
          console.error(e);
          return of(e);
        }),
      )),
      tap((v) => {
        if (v !== 'chill') creature.process({ type: 'scan' });
      }),
      catchError((e) => {
        console.error(e);
        return of(e);
      }),
      retry(),
      publish(),
    );

    stream.connect();

    return stream;
  }
}
