const Player = require('../../../src/model/Player');

describe('party', () => {
  let leader, follower;

  beforeAll(async () => {
    leader = new Player({ ...CONFIG.get('player'), name: 'leader' });
    await leader.perform('spawn');
    follower = new Player({ ...CONFIG.get('player'), name: 'follower' });
    await follower.perform('spawn');
  });

  afterAll(() => {
    leader.removeAllPossibleListeners();
    follower.removeAllPossibleListeners();
  });

  test('self party', () => {
    expect(leader.$party.has(leader)).toBe(true);
    expect(follower.$party.has(follower)).toBe(true);
  });

  test('uninvited rejected', async () => {
    await follower.perform('cmd', 'follow leader');
    expect(leader.$party.has(follower)).toBe(false);
  });

  test('invited ok', async () => {
    await leader.perform('cmd', 'invite follower');
    await follower.perform('cmd', 'follow leader');
    expect(leader.$party.has(leader)).toBe(true);
    expect(leader.$party.has(follower)).toBe(true);
    expect(leader.$party).toBe(follower.$party);
  });

  test('movement', async () => {
    // Leader moves
    await leader.perform('cmd', 's');
    expect(leader.$party.has(follower)).toBe(true);

    // Follower moves
    await follower.perform('cmd', 'n');
    expect(leader.$party.has(follower)).toBe(false);

    // Reunite
    await follower.perform('cmd', 's');
    await leader.perform('cmd', 'invite follower');
    await follower.perform('cmd', 'follow leader');
  });

  test('leave ok', async () => {
    await follower.perform('cmd', 'leave');
    expect(leader.$party.has(leader)).toBe(true);
    expect(leader.$party.has(follower)).toBe(false);
    expect(leader.$party).not.toBe(follower.$party);
    expect(follower.$party.has(follower)).toBe(true);
  });

  test('follower invite', async () => {
    await follower.perform('cmd', 'invite leader');
    await leader.perform('cmd', 'follow follower');
    expect(follower.$party.has(follower)).toBe(true);
    expect(follower.$party.has(leader)).toBe(true);
    expect(leader.$party.has(leader)).toBe(true);
    expect(leader.$party.has(follower)).toBe(true);
    expect(leader.$party).toBe(follower.$party);
  });
});
