const Util = require('@coderich/util');
const Player = require('../../../src/model/Player');

describe('terrifying', () => {
  let player, horror;

  beforeAll(async () => {
    player = new Player({ ...CONFIG.get('player'), name: 'player1' });
    await player.perform('spawn');
    horror = new Player({ ...CONFIG.get('player'), name: 'horror' });
    await horror.perform('spawn');
  });

  afterEach(() => {
    player.streams.trait.abort();
    horror.streams.trait.abort();
  });

  test('lifeforce player', async () => {
    player.stream('trait', 'lifeforce');
    await player.save({ hp: 1 });
    await Util.timeout(50);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBeGreaterThan(1);
  });

  test('terrifying horror', async () => {
    horror.stream('trait', 'terrifying');
    player.stream('trait', 'lifeforce');
    await Util.timeout(50); // This ensures lifeforce is setup
    await player.save({ hp: 1 });
    await Util.timeout(50);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBe(1);

    // Horror leaves the room
    await horror.perform('cmd', 's');
    await Util.timeout(50);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBeGreaterThan(1);

    // Horror enters the room
    await horror.perform('cmd', 'n');
    await Util.timeout(50); // This ensures lifeforce is setup
    await player.save({ hp: 1 });
    await Util.timeout(50);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBe(1);

    // Player leaves the room
    await player.perform('cmd', 's');
    await Util.timeout(50);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBeGreaterThan(1);

    // Player enters the room
    await player.perform('cmd', 'n');
    await Util.timeout(50); // This ensures lifeforce is setup
    await player.save({ hp: 1 });
    await Util.timeout(50);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBe(1);

    // Player re-enters the realm
    await player.perform('cmd', 'x');
    await player.perform('spawn');
    player.stream('trait', 'lifeforce');
    await Util.timeout(50); // This ensures lifeforce is setup
    await player.save({ hp: 1 });
    await Util.timeout(50);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBe(1);

    // Horror leaves the realm
    await horror.perform('cmd', 'x');
    await Util.timeout(50);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBeGreaterThan(1);
  });

  test('terrifying aborted', async () => {
    player.stream('trait', 'lifeforce');
    await player.save({ hp: 1 });
    await Util.timeout(50);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBeGreaterThan(1);
  });
});
