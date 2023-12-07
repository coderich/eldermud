const Util = require('@coderich/util');
const RedisClient = require('./src/client/RedisClient');
const ConfigClient = require('./src/client/ConfigClient');
const server = require('./src/server');

(() => {
  if (require.main === module) {
    global.Config = new ConfigClient();
    global.Config.set('data', Util.requireDir(`${__dirname}/src/data`));
    global.Redis = new RedisClient(Config.get('redis'));
    Util.requireDir(`${__dirname}/src/action`);
    server.start();
  }
})();
