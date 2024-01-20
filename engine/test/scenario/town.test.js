const Player = require('../../src/model/Player');
const NPC = require('../../src/model/NPC');
const app = require('../../app');

describe('town', () => {
  let player, dorian;

  beforeAll(async () => {
    await app.setup();
    player = new Player();
    const room = CONFIG.get('map.town.rooms.start');
    ([dorian] = Array.from(room.units.values()));
    expect(dorian).toBeInstanceOf(NPC);
    await player.save({ ...CONFIG.get('class.assassin'), ...CONFIG.get('player'), ...player }, true);
    expect(`${player.room}`).toEqual('map.town.rooms.start');
  });

  afterAll(() => {
    player.removeAllPossibleListeners();
    dorian.removeAllPossibleListeners();
  });

  test('spawn', async () => {
    await player.perform('spawn');
    const units = Array.from(player.room.units.values());
    expect(units.length).toBe(2);
    expect(units).toEqual([dorian, player]);
  });

  test('walk', async () => {
    await player.perform('cmd', 's');
    expect(`${player.room}`).toEqual('map.town.rooms.tunnel1');

    // Hit closed door
    await player.perform('cmd', 's');
    expect(`${player.room}`).toEqual('map.town.rooms.tunnel1');

    // Open door and continue
    await player.perform('cmd', 'open s');
    await player.perform('cmd', 's');
    expect(`${player.room}`).toEqual('map.town.rooms.tunnel2');
  });

  test('look to spawn', async () => {
    await player.perform('cmd', 'close n');
    const room = CONFIG.get('map.town.rooms.blockade');
    expect(Array.from(room.units)).toEqual([]);
    // await player.perform('cmd', 'l e');
    // expect(Array.from(room.units).length).toBeGreaterThan(0);
  });
});
