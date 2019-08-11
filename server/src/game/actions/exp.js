import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { emit } from '../../service/socket.service';
import { createAction } from '../../service/stream.service';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const exp = await getData(id, 'exp');
    emit(id, 'message', { type: 'info', value: `You have ${exp} souls.` });
  }),
);
