import { Subject, of } from 'rxjs';
import { tap, map, concatMap, catchError } from 'rxjs/operators';
import { translate } from '../service/command.service';
import AbortActionError from './AbortActionError';

export default class Stream {
  constructor(subject) {
    return new Subject().pipe(
      tap(input => input === 'x' && subject.balk('intercepted')),
      map(input => translate(input)),
      map((command) => {
        if (command.scope === 'navigation') {
          return subject.move(command.code);
        }

        switch (command.name) {
          case 'open': case 'close': {
            const dir = translate(command.args[0]);
            return subject[command.name](dir.code);
          }
          case 'look': {
            return subject.look();
          }
          case 'get': {
            const target = command.args.join(' ');
            return subject.grab(target);
          }
          case 'drop': {
            const target = command.args.join(' ');
            return subject.drop(target);
          }
          case 'search': {
            return subject.search();
          }
          case 'use': {
            const dir = translate(command.args[command.args.length - 1]);

            if (dir.scope === 'navigation') {
              return of('more').pipe(
                concatMap(async () => {
                  const room = await subject.Room();
                  const door = room.Door(dir.code) || subject.balk('There is nothing in that direction!');

                  const target = command.args.slice(0, -1).join(' ');
                  const item = subject.findItem(target);
                  return item.use(door);
                }),
              );
            }

            const target = command.args.join(' ');
            const item = subject.findItem(target);
            return item.use();
          }
          case 'inventory': {
            return subject.inventory();
          }
          case 'none': {
            return of('more').pipe(
              concatMap(async () => {
                return subject.describe('room', await subject.Room());
              }),
            );
          }
          default: {
            return of({ type: 'info', value: 'Your command had no effect.' });
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
    );
  }
}
