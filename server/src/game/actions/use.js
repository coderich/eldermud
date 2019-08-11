import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';

export default async (id, command, dir) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const target = dir.scope === 'navigation' ? command.args.slice(0, -1).join(' ') : command.args.join(' ');
    const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');
    await unit.perform(() => item.use(unit));
  }),
);
