const { timeout } = require('@coderich/util');
const { RedisMemoryServer } = require('redis-memory-server');
const { init } = require('./app');

let redisServer;

beforeAll(async () => {
  // Redis setup
  redisServer = new RedisMemoryServer();
  const host = await redisServer.getHost();
  const port = await redisServer.getPort();
  const url = `redis://${host}:${port}`;

  // Config setup
  process.env.app__redis__url = url;

  // Initialize app
  init();
});

afterAll(async () => {
  await timeout(100); // Give a chance for redis to flush it's queue?
  await global.SYSTEM.removeAllListeners();
  await global.REDIS.quit();
  await redisServer.stop();
});
