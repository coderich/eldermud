import { Subject, of } from 'rxjs';
import { tap, map, concatMap, catchError, retry } from 'rxjs/operators';
import { translate } from '../service/command.service';
import AbortActionError from './AbortActionError';

export default class CreatureStream {
  constructor(creature) {
    return new Subject().pipe(
      tap(input => input === 'x' && creature.balk('intercepted')),
      map(input => translate(input)),
      map((command) => {
        if (command.scope === 'navigation') {
          return creature.move(command.code);
        }

        switch (command.name) {
          case 'open': case 'close': {
            const target = command.args.join(' ');
            return creature[command.name](target);
          }
          case 'look': {
            const target = command.args.join(' ');
            return creature.look(target);
          }
          case 'get': {
            const target = command.args.join(' ');
            return creature.get(target);
          }
          case 'drop': {
            const target = command.args.join(' ');
            return creature.drop(target);
          }
          case 'search': {
            return creature.search();
          }
          case 'use': {
            const dir = translate(command.args[command.args.length - 1]);
            return creature.use(command, dir);
          }
          case 'inventory': {
            return creature.inventory();
          }
          case 'none': {
            return of('none').pipe(
              concatMap(async () => {
                return creature.describe('room', await creature.Room());
              }),
            );
          }
          default: {
            return creature.say(command.input);
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
