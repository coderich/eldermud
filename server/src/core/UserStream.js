import { Subject, of } from 'rxjs';
import { tap, map, concatMap, catchError, retry } from 'rxjs/operators';
import { translate } from '../service/CommandService';
import AbortActionError from '../error/AbortActionError';
import InterruptActionError from '../error/InterruptActionError';

export default class UserStream {
  constructor(user) {
    return new Subject().pipe(
      tap(input => input === 'x' && user.abortAction('intercepted')),
      map(input => translate(input)),
      map((command) => {
        if (command.scope === 'navigation') {
          return user.move(command.code);
        }

        switch (command.name) {
          case 'attack': {
            const target = command.args.join(' ');
            return user.attack(target);
          }
          case 'open': case 'close': {
            const target = command.args.join(' ');
            return user[command.name](target);
          }
          case 'look': {
            const target = command.args.join(' ');
            return user.look(target);
          }
          case 'get': {
            const target = command.args.join(' ');
            return user.get(target);
          }
          case 'drop': {
            const target = command.args.join(' ');
            return user.drop(target);
          }
          case 'search': {
            return user.search();
          }
          case 'use': {
            const dir = translate(command.args[command.args.length - 1]);
            return user.use(command, dir);
          }
          case 'inventory': {
            return user.inventory();
          }
          case 'none': {
            return of('none').pipe(
              concatMap(async () => {
                return user.describe('room', await user.Room());
              }),
            );
          }
          default: {
            return user.say(command.input);
          }
        }
      }),
      concatMap(action => action.pipe(
        catchError((e) => {
          if (e instanceof AbortActionError) return of({ type: 'error', value: e.message });
          if (e instanceof InterruptActionError) return of({ type: 'info', value: e.message });
          console.error(e);
          return of(e);
        }),
      )),
      retry(),
    );
  }
}
