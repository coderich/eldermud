import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';

export default (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    unit.break();
  }),
);
