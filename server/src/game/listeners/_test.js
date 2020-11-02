import { gameEmitter } from '../../service/event.service';

gameEmitter.on('pre:equip', ({ quest, user }, next) => {
  console.log('stop the maddness');
  throw new Error('You cant do that');
});

export default {};
