import { gameEmitter } from '../../service/event.service';

gameEmitter.on('pre:buy', ({ unit, user = unit }, next) => {
  user.abortAction('Stop in the name of love.');
});

export default {};
