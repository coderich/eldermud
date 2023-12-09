const Util = require('@coderich/util');
const ConfigClient = require('./src/client/ConfigClient');
const RedisClient = require('./src/client/RedisClient');
const server = require('./src/server');

(() => {
  if (require.main === module) {
    global.Config = new ConfigClient(`${__dirname}/src/config`);
    global.Redis = new RedisClient(Config.get('redis'));
    Util.requireDir(`${__dirname}/src/game`);
    server.start();
  }
})();
