import { setData } from '../../service/data.service';
import { gameEmitter } from '../../service/event.service';

gameEmitter.on('quest:begin', ({ quest, user }) => {
  setData(user.id, 'quests', Object.assign(user.quests, { [quest.id]: 1 }));
});

export default {};
