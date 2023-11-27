import SocketIO from 'socket.io-client';
import { Services } from '@coderich/hotrod';

const { $history, $storage } = Services.get();
let query = Object.entries($storage.get('query') || {}).map(([key, value]) => `${key}=${value}`).join('&');
if ($history.location.search) query = `${$history.location.search.substr(1)}&${query}`;
const server = SocketIO('http://localhost:3003', { query });

export default server;
