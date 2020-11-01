import { gameEmitter } from '../../service/event.service';

gameEmitter.on('room:enter', ({ room, unit }) => {
});

export default {};
