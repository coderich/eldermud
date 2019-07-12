import { Subject, of } from 'rxjs';
import { tap, map, concatMap, catchError, retry } from 'rxjs/operators';
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
            const target = command.args.join(' ');
            return subject[command.name](target);
          }
          case 'look': {
            const target = command.args.join(' ');
            return subject.look(target);
          }
          case 'get': {
            const target = command.args.join(' ');
            return subject.get(target);
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
            return subject.use(command, dir);
          }
          case 'inventory': {
            return subject.inventory();
          }
          case 'none': {
            return of('none').pipe(
              concatMap(async () => {
                return subject.describe('room', await subject.Room());
              }),
            );
          }
          default: {
            return subject.say(command.input);
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
      retry(),
    );
  }
}
