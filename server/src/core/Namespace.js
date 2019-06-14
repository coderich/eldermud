import { Action, Selector } from '@coderich/hotrod';

export default class Namespace {
  constructor(server, name) {
    this.name = name;
    this.ns = server.of(`/${name}`);
  }

  getModule() {
    const actions = {
      connect: new Action('socket.connect'),
      disconnecting: new Action('socket.disconnecting'),
      disconnected: new Action('socket.disconnected'),
      error: new Action('socket.error'),
      socketBroadcast: new Action('socket.broadcast', ({ id, message }) => { selectors.socket.get(id).broadcast.emit('message', message); }),
      socketMessage: new Action('socket.message', ({ id, message }) => { selectors.socket.get(id).emit('message', message); }),
      serverBroadcast: new Action('server.broadcast', (message) => { server.emit('message', message); }),
    };
  }
}
