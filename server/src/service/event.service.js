// https://socket.io/docs/emit-cheatsheet/

export const emit = async (type, payload) => {
  switch (type) {
    case 'move': {
      const { being, to, from } = payload;

      from.leave(being.id); to.join(being.id);

      if (being.isUser) {
        const toRoom = `room-${to.id}`;
        const fromRoom = `room-${from.id}`;
        being.socket.leave(fromRoom);
        being.socket.join(toRoom);
        being.socket.to(toRoom).emit('message', { type: 'info', value: `${being.name} has entered the room.` });
        being.socket.to(fromRoom).emit('message', { type: 'info', value: `${being.name} has just left the room.` });
      }

      (await to.Beings()).filter(b => b.isCreature).forEach(creature => creature.process({ type, payload }));
      (await from.Beings()).filter(b => b.isCreature).forEach(creature => creature.process({ type, payload }));

      break;
    }
    case 'say': {
      const { being, room, phrase } = payload;
      const toRoom = `room-${room.id}`;
      being.socket.to(toRoom).emit('message', { type: 'info', value: `${being.name} says "${phrase}"` });
      break;
    }
    case 'status': {
      const { being } = payload;
      being.socket.emit('message', { type: 'status', value: { hp: being.hp } });
      break;
    }
    case 'attack': {
      const { source, target, hit, damage } = payload;

      if (source.room === target.room && !source.dead) {
        const room = await source.Room();
        const playersInRoom = await room.Players();
        const roomId = `room-${source.room}`;

        if (source.isUser) {
          if (hit) {
            source.socket.emit('message', { type: 'error', value: `You hit ${target.name} for ${damage} damage!` });
          } else {
            source.socket.emit('message', { type: 'info', value: `You swing at ${target.name}, but miss!` });
          }
        }

        if (target.isUser) {
          if (hit) {
            target.socket.emit('message', { type: 'error', value: `The ${source.name} hits you for ${damage} damage!` });
            target.socket.emit('message', { type: 'status', value: { hp: target.hp } });
          } else {
            target.socket.emit('message', { type: 'info', value: `The ${source.name} swings at you, but misses!` });
          }
        } else {
          // eslint-disable-next-line
          if (hit) {
            source.socket.to(roomId).emit('message', { type: 'error', value: `${source.name} hits ${target.name} for ${damage} damage!` });
          } else {
            source.socket.to(roomId).emit('message', { type: 'info', value: `${source.name} swings at ${target.name}, but misses!` });
          }
        }

        if (hit) {
          target.hp -= damage;
          if (target.hp < 1 && target.isCreature) {
            target.dead = true;
            room.leave(target.id);
            source.socket.emit('message', { type: 'info', value: `The ${target.name} falls to the ground.` });
            source.socket.to(roomId).emit('message', { type: 'info', value: `The ${target.name} falls to the ground.` });
            const playersInCombat = playersInRoom.filter(player => player.combatEngaged === target);
            const expEach = Math.ceil(target.exp / playersInCombat.length);
            playersInCombat.forEach((player) => {
              player.exp += expEach;
              source.socket.emit('message', { type: 'info', value: `You gain ${expEach} experience.` });
            });
          }
        }
      }
      break;
    }
    default: {
      break;
    }
  }
};

export const stfu = {};
