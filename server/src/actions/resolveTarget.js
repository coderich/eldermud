import { mergeMap } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { createAction } from '../service/stream.service';

export default async (id, collection, target, msg) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const result = await unit.resolveTarget(collection, target) || unit.abortAction(msg);
    return result;
  }),
);
