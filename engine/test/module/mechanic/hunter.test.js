const Util = require('@coderich/util');
const Player = require('../../../src/model/Player');

describe('hunter', () => {
  let player, hunter;

  beforeAll(async () => {
    player = new Player({ ...CONFIG.get('player'), name: 'hunted' });
    await player.perform('spawn');
    hunter = new Player({ ...CONFIG.get('player'), name: 'hunter' });
    await hunter.perform('spawn');
  });

  afterEach(() => {
    player.streams.trait.abort();
    hunter.streams.trait.abort();
  });

  test('hunter moving', (done) => {
    const spy = jest.fn(() => done());
    expect(`${hunter.room}`).toEqual('map.town.rooms.start');
    hunter.once('post:move', spy);
    expect(spy).toHaveBeenCalledTimes(0);
    hunter.stream('trait', 'hunter');
  });

  test('hunter not moving while engaged', (done) => {
    const spy = jest.fn(() => done());
    hunter.once('post:move', spy);
    expect(spy).toHaveBeenCalledTimes(0);
    hunter.$target = player;
    hunter.stream('trait', 'hunter');
    Util.timeout(200).then(() => {
      expect(spy).toHaveBeenCalledTimes(0);
      delete hunter.$target;
    });
  });

  test('hunter not moving when aborted', async () => {
    const spy = jest.fn();
    hunter.once('post:move', spy);
    await Util.timeout(50);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
