const Util = require('@coderich/util');
const Redis = require('@coderich/redis');
const { Action } = require('@coderich/gameflow');
const ConfigClient = require('../client/ConfigClient');

Action.define('bootstrap', async () => {
  global.Config = new ConfigClient();
  global.Config.set('data', Util.requireDir(`${__dirname}/../data`));
  global.DB = new Redis(Config.get('redis'));
});
