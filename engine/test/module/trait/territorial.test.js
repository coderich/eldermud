const Util = require('@coderich/util');
const Player = require('../../../src/model/Player');

describe('territorial', () => {
  let player, creature;

  beforeAll(async () => {
    player = new Player({ ...CONFIG.get('player'), name: 'player1' });
    await player.perform('spawn');
    creature = await APP.instantiate('creature.test', { room: player.room });
    await creature.perform('spawn');
  });

  afterEach(() => {
    player.streams.trait.abort();
    creature.streams.trait.abort();
  });

  test('creature attacks player (in room)', async () => {
    await Util.timeout(50);
    expect(creature.$target).not.toBeDefined();
    expect(creature.$engaged).toBeFalsy();
    creature.stream('trait', 'territorial');
    await Util.timeout(50);
    expect(creature.$target).toEqual(player);
    expect(creature.$engaged).toBe(true);
    await creature.perform('break');
  });

  test('creature attacks player (who walks in)', async () => {
    await creature.perform('cmd', 's');
    expect(creature.$target).not.toBeDefined();
    expect(creature.$engaged).toBeFalsy();
    creature.stream('trait', 'territorial');
    await Util.timeout(50);
    expect(creature.$target).not.toBeDefined();
    expect(creature.$engaged).toBeFalsy();
    await player.perform('cmd', 's');
    await Util.timeout(50);
    expect(creature.$target).toEqual(player);
    expect(creature.$engaged).toBe(true);
    await creature.perform('break');
  });

  test('creature attacks player (walking into their room)', async () => {
    await creature.perform('cmd', 'n');
    creature.stream('trait', 'territorial');
    await Util.timeout(50);
    expect(creature.$target).not.toBeDefined();
    expect(creature.$engaged).toBeFalsy();
    await creature.perform('cmd', 's');
    await Util.timeout(50);
    expect(creature.$target).toEqual(player);
    expect(creature.$engaged).toBe(true);
    await creature.perform('break');
  });

  test('creature attacks player (who enters realm)', async () => {
    await player.perform('cmd', 'x');
    creature.stream('trait', 'territorial');
    expect(creature.$target).not.toBeDefined();
    expect(creature.$engaged).toBeFalsy();
    await player.perform('spawn');
    await Util.timeout(50);
    expect(creature.$target).toEqual(player);
    expect(creature.$engaged).toBe(true);
    await creature.perform('break');
  });

  test('dead creatures do not attack', async () => {
    await player.perform('cmd', 'n');
    await creature.stream('trait', 'territorial');
    await creature.perform('affect', { hp: -100 });
    expect(creature.$target).not.toBeDefined();
    expect(creature.$engaged).toBeFalsy();
    await player.perform('cmd', 's');
    await Util.timeout(50);
    expect(creature.$target).not.toBeDefined();
    expect(creature.$engaged).toBeFalsy();
  });
});
