import { setData, pushData } from '../../service/data.service';
import { gameEmitter } from '../../service/event.service';
import { resolveTrigger } from '../../service/game.service';

gameEmitter.on('quest:begin', ({ quest, user }) => {
  setData(user.id, 'history', Object.assign(user.history, { [quest.id]: [] }));
  pushData(user.id, 'quests', quest.id);
});

gameEmitter.on('quest:progress', ({ user, effect, trigger }) => {
  user.history[effect.quest].push(trigger.id);
  setData(user.id, 'history', user.history);
});

gameEmitter.on('room:enter', async (event) => {
  const { unit } = event;
  if (!unit.isUser) return;
  event.user = event.unit;
  const quests = await unit.Quests();

  //
  quests.filter(q => q.triggers.find(t => t.event === 'room:enter')).forEach((quest) => {
    quest.triggers.forEach(trigger => resolveTrigger(trigger, quest.id, event));
  });
});

export default {};
