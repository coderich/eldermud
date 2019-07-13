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
      const { source, target, damage } = payload;

      if (source.room === target.room) {
        target.hp -= damage;

        if (source.isUser) {
          source.socket.emit('message', { type: 'error', value: `You hit ${target.name} for ${damage} damage!` });
        }

        if (target.isUser) {
          target.socket.emit('message', { type: 'error', value: `${source.name} hit you for ${damage} damage!` });
          target.socket.emit('message', { type: 'status', value: { hp: target.hp } });
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
