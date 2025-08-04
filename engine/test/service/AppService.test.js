const AppService = require('../../src/service/AppService');

describe('AppService', () => {
  test('roll', () => {
    expect(AppService.roll('5')).toBe(5);
    expect(AppService.roll('0d5')).toBe(0);
    expect(AppService.roll('-5')).toBe(-5);
    expect(AppService.roll('-1d1')).toBe(-1);
    expect(AppService.roll('1d1*5')).toBe(5);
    expect(AppService.roll('2d1/2')).toBe(1);
    expect(AppService.roll('3d1**3')).toBe(27);
  });

  test('stripColorTags', () => {
    expect(AppService.stripColorTags('<LightSeaGreen>Random  <reset>')).toBe('Random  ');
    expect(AppService.stripColorTags('<LightSeaGreen>12<DimGrey>+2<reset>  <reset>')).toBe('12+2  ');
  });

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
    expect(AppService.fibStat(1)).toBe(1);
    expect(AppService.fibStat(3)).toBe(3);
    expect(AppService.fibStat('3')).toBe(3);
    expect(AppService.fibStat(10)).toBe(10);
    expect(AppService.fibStat(11)).toBe(13);
    expect(AppService.fibStat(20)).toBe(40);
    expect(AppService.fibStat(21)).toBe(45);
  });

  test('instantiate', async () => {
    const [rat, dorian, rope] = await AppService.instantiate(['creature.rat', 'npc.dorian', 'item.rope'], { test: 'test' });

    // Data checks
    expect(rat).toMatchObject({ name: 'Rat', test: 'test' });
    expect(dorian).toMatchObject({ name: 'Dorian', test: 'test' });
    expect(rope).toMatchObject({ name: 'Rope & Grapple', test: 'test' });

    // Redis keys
    expect(`${rat}`).toEqual('creature.rat.1');
    expect(`${dorian}`).toEqual('npc.dorian.1');
    expect(`${rope}`).toEqual('item.rope.1');
  });

  test('interpolate', () => {
    expect(AppService.interpolate('Hello {actor.name}, you are {actor.age} *. Congrats!', { actor: { age: 100, name: 'Rich' } })).toBe('Hello Rich, you are 100 *. Congrats!');
  });
});
