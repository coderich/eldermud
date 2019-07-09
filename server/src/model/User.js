import { Subject } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import Being from '../core/Being';
import { translate } from '../service/command.service';
import AbortActionError from '../core/AbortActionError';

export default class User extends Being {
  constructor(...args) {
    super(...args);

    this.memory = [];

    this.stream$ = new Subject().pipe(
      map(input => translate(input)),
      concatMap(async (command) => {
        try {
          switch (command.scope) {
            case 'navigation': {
              return await this.move(command.code);
            }
            default: {
              switch (command.name) {
                case 'open': case 'close': {
                  const dir = translate(command.args[0]);
                  return await this[command.name](dir.code);
                }
                case 'look': {
                  return await this.look();
                }
                case 'get': {
                  const target = command.args.join(' ');
                  return await this.grab(target);
                }
                case 'drop': {
                  const target = command.args.join(' ');
                  return await this.drop(target);
                }
                case 'search': {
                  return await this.search();
                }
                case 'use': {
                  const dir = translate(command.args[command.args.length - 1]);

                  if (dir.scope === 'navigation') {
                    const room = await this.Room();
                    const door = await room.Door(dir.code) || this.balk('There is nothing in that direction!');

                    const target = command.args.slice(0, -1).join(' ');
                    const item = await this.findItem(target);
                    return await item.use(door);
                  }

                  const target = command.args.join(' ');
                  const item = await this.findItem(target);
                  return await item.use();
                }
                case 'inventory': {
                  return await this.inventory();
                }
                case 'none': {
                  return await this.describe('room', await this.Room());
                }
                default: {
                  return await this.describe('info', 'Your command had no effect.');
                }
              }
            }
          }
        } catch (e) {
          if (e instanceof AbortActionError) return this.describe('error', e.message);
          console.error(e);
          return e;
        }
      }),
    );
  }

  async findItem(target, take = false) {
    let index;
    const items = await this.Items();

    // Try plain search
    index = items.findIndex(it => it.name.indexOf(target.toLowerCase()) === 0);

    // Try Tokenize
    if (index < 0) {
      index = items.findIndex((it) => {
        const tokens = it.name.toLowerCase().split(' ');
        return tokens.find(tok => tok.indexOf(target.toLowerCase()) === 0);
      });
    }

    if (index < 0) this.balk("You don't have that on you!");

    if (take) {
      this.items.splice(index, 1);
    }

    return items[index];
  }
}
