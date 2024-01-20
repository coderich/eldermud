const Util = require('@coderich/util');
const Player = require('../../../src/model/Player');

describe('lifeforce', () => {
  let player;

  beforeAll(async () => {
    player = new Player({ ...CONFIG.get('player') });
    await player.save({ hp: 1 }); // Set HP low
  });

  test('increases life (not beyond max)', async () => {
    // Sanity check hp level
    await Util.timeout(10);
    expect(player.hp).toEqual(1);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBe(1);

    // Assign lifeforce
    player.stream('trait', 'lifeforce');
    await Util.timeout(10);
    // expect(player.hp).toEqual(25);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBe(25);
  });

  test('aborting stream no longer provided life', async () => {
    player.streams.trait.abort();
    await player.save({ hp: 1 });
    expect(player.hp).toEqual(1);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBe(1);
    await Util.timeout(10);
    expect(player.hp).toBe(1);
    expect(parseInt(await REDIS.get(`${player}.hp`), 10)).toBe(1);
  });
});
