export const emit = (type, payload) => {
  switch (type) {
    case 'move': {
      const { being, to, from } = payload;

      from.leave(being); to.join(being);

      if (being.isUser) {
        const toRoom = `room-${to.id}`;
        const fromRoom = `room-${from.id}`;
        being.socket.leave(fromRoom);
        being.socket.join(toRoom);
        being.socket.to(toRoom).emit('message', { type: 'info', value: `${being.id} has entered the room.` });
        being.socket.to(fromRoom).emit('message', { type: 'info', value: `${being.id} has just left the room.` });
      }

      break;
    }
    case 'say': {
      const { being, room, phrase } = payload;
      const toRoom = `room-${room.id}`;
      being.socket.to(toRoom).emit('message', { type: 'info', value: `${being.id} says "${phrase}"` });
      break;
    }
    default: {
      break;
    }
  }
};

export const stfu = {};
