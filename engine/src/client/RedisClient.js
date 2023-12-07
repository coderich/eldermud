const Redis = require('redis');

module.exports = class RedisClient {
  constructor({ url, namespace }) {
    const client = Redis.createClient({ url });
    const connection = client.connect();

    return new Proxy(client, {
      get(target, method) {
        return (...args) => connection.then(() => client[method](...args));
      },
    });
  }
};
