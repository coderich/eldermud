import { mergeMap } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { createAction } from '../service/stream.service';

export default async (id, command) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const talent = await getData(command.id);
    if (!talent || unit.talents.indexOf(talent.id) === -1) unit.breakAction('Your command had no effect.');

    switch (talent.type) {
      case 'instant': {
        if (talent.cost > unit.exp) unit.breakAction('Insufficient power.');
        return unit.perform(() => talent.execute(id, command));
      }
      case 'combat': return null;
      default: return null;
    }
  }),
);
