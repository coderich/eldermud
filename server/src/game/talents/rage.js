import { delay, mergeMap } from 'rxjs/operators';
import { getData, setData, incData } from '../../service/data.service';
import { writeStream, createAction, createLoop } from '../../service/stream.service';

const cost = 50;
const code = 'rage';
const duration = 10;

export default async (id, command) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const stream = `${this.id}.${code}`;
    if (cost > unit.exp) unit.breakAction('Insufficient mana.');

    return unit.perform(async () => {
      await incData(id, 'exp', -cost);
      unit.emit('message', { type: 'water', value: 'You focus your energy inwards.' });
      unit.emit('message', { type: 'water', value: 'You feel enraged!' });

      let count = 0;
      writeStream(stream, 'abort');
      writeStream(stream, createLoop(
        mergeMap(async () => {
          const player = await getData(id);
          const hp = Math.min(player.mhp, player.hp + 2);
          setData(id, 'hp', hp);
          player.status();
          if (++count >= duration) player.breakAction('The effects of rage wear off.');
        }),
        delay(2500),
      ));
    });
  }),
);
