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
});
