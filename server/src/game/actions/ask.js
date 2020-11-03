import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { gameEmitter } from '../../service/event.service';
import { resolveInteraction } from '../../service/game.service';

export default (id, input) => {
  const [, phrase] = input.match(/"([\S\s]+)"/) || [];
  const subject = input.substr(0, input.indexOf('"')).trim();

  return createAction(
    mergeMap(async () => {
      const unit = await getData(id);
      const room = await unit.Room();
      const target = await room.resolveTarget('units', subject, { omit: [id] });
      if (!phrase || !target || !target.isNPC) return unit.say(`ask ${input}`);

      const event = { unit, room, target };
      await gameEmitter.emit('pre:ask', event);
      await resolveInteraction(room, target, unit, 'ask', phrase);
      return gameEmitter.emit('post:ask', event);
    }),
  );
};
