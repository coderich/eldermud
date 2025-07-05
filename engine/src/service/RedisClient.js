const Redis = require('redis');

module.exports = class RedisClient {
  constructor({ url, namespace }) {
    const client = Redis.createClient({ url });
    const connection = client.connect();

    // Listeners (error is mandatory!)
    client.on('error', (e) => {
      console.log(e);
    });

    client.on('connect', (e) => {
      console.log('Initiating a connection to the server');
    });

    client.on('reconnecting', (e) => {
      console.log('Client is trying to reconnect to the server');
    });

    client.on('ready', (e) => {
      console.log('Client is ready to use');
    });

    client.on('end', (e) => {
      console.log('Connection has been closed (via .quit() or .disconnect())');
    });

    return new Proxy(client, {
      get(target, method) {
        return (...args) => connection.then(() => {
          if (!client[method]) console.log(method);
          return client[method](...args).catch((e) => {
            console.log(method, ...args);
            throw e;
          });
        });
      },
    });
  }
};
