import { mergeMap } from 'rxjs/operators';
import { getData, pushData, incData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const trainer = await room.Trainer() || unit.abortAction('There is no trainer here!');
    const talent = (await trainer.resolveTarget('talents', target)) || unit.abortAction('Trainer does not know that talent!');
    if (await unit.resolveTarget('talents', target)) unit.abortAction('You already know that talent!');
    const { str = 0, agi = 0, int = 0 } = talent.req;
    if (unit.str < str || unit.agi < agi || unit.int < int) unit.breakAction('Failed to meet requirements.');
    if (unit.exp < talent.cost) unit.breakAction('Insufficient souls.');

    await Promise.all([
      pushData(unit.id, 'talents', talent.id),
      incData(unit.id, 'exp', -talent.cost),
    ]);

    unit.stats();
    unit.status();
    unit.emit('message', { type: 'info', value: `You just learned ${talent.name}!` });
  }),
);
