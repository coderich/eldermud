const AppService = require('../../src/service/AppService');

describe('AppService', () => {
  test('isNumeric', () => {
    expect(AppService.isNumeric()).toBe(false);
    expect(AppService.isNumeric(null)).toBe(false);
    expect(AppService.isNumeric(0)).toBe(true);
    expect(AppService.isNumeric('0')).toBe(true);
  });

  test('fibStat', () => {
    expect(AppService.fibStat()).toBe(0);
    expect(AppService.fibStat(null)).toBe(0);
    expect(AppService.fibStat(undefined)).toBe(0);
    expect(AppService.fibStat(0)).toBe(0);
    expect(AppService.fibStat('0')).toBe(0);
    expect(AppService.fibStat(1)).toBe(3);
    expect(AppService.fibStat(3)).toBe(9);
    expect(AppService.fibStat('3')).toBe(9);
    expect(AppService.fibStat(10)).toBe(30);
    expect(AppService.fibStat(11)).toBe(35);
    expect(AppService.fibStat(20)).toBe(80);
    expect(AppService.fibStat(21)).toBe(88);
  });

  test('instantiate', async () => {
    const [rat, dorian, rope] = await AppService.instantiate(['creature.rat', 'npc.dorian', 'item.rope'], { test: 'test' });

    // Data checks
    expect(rat).toMatchObject({ name: 'rat', test: 'test' });
    expect(dorian).toMatchObject({ name: 'Dorian', test: 'test' });
    expect(rope).toMatchObject({ name: 'rope & grapple', test: 'test' });

    // Redis keys
    expect(`${rat}`).toEqual('creature.rat.1');
    expect(`${dorian}`).toEqual('npc.dorian.1');
    expect(`${rope}`).toEqual('item.rope.1');
  });
});
