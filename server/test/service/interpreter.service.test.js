const InterpreterService = require('../../src/service/interpreter.service');

describe('InterpreterService', () => {
  test('Attack command', () => {
    expect(InterpreterService.translate('a').cmd).toEqual('attack');
    expect(InterpreterService.translate('at').cmd).toEqual('attack');
    expect(InterpreterService.translate('att').cmd).toEqual('attack');
    expect(InterpreterService.translate('atta').cmd).toEqual('attack');
    expect(InterpreterService.translate('attac').cmd).toEqual('attack');
    expect(InterpreterService.translate('attack').cmd).toEqual('attack');

    expect(InterpreterService.translate('a bird').cmd).toEqual('attack');
    expect(InterpreterService.translate('at bird').cmd).toEqual('attack');
    expect(InterpreterService.translate('att bird').cmd).toEqual('attack');
    expect(InterpreterService.translate('atta bird').cmd).toEqual('attack');
    expect(InterpreterService.translate('attac bird').cmd).toEqual('attack');
    expect(InterpreterService.translate('attack bird').cmd).toEqual('attack');

    expect(InterpreterService.translate('attacks').cmd).toEqual('unknown');
    expect(InterpreterService.translate('a bird is singing').cmd).toEqual('unknown');
  });

  test('North command', () => {
    expect(InterpreterService.translate('n').cmd).toEqual('north');
    expect(InterpreterService.translate('no').cmd).toEqual('north');
    expect(InterpreterService.translate('nor').cmd).toEqual('north');
    expect(InterpreterService.translate('nort').cmd).toEqual('north');
    expect(InterpreterService.translate('north').cmd).toEqual('north');

    expect(InterpreterService.translate('n a').cmd).toEqual('unknown');
    expect(InterpreterService.translate('no a').cmd).toEqual('unknown');
    expect(InterpreterService.translate('nor a').cmd).toEqual('unknown');
    expect(InterpreterService.translate('nort a').cmd).toEqual('unknown');
    expect(InterpreterService.translate('north a').cmd).toEqual('unknown');
  });

  test('Repeat command', () => {
    expect(InterpreterService.translate('r').cmd).toEqual('unknown');
    expect(InterpreterService.translate('re').cmd).toEqual('repeat');
    expect(InterpreterService.translate('rep').cmd).toEqual('repeat');
    expect(InterpreterService.translate('repe').cmd).toEqual('repeat');
    expect(InterpreterService.translate('repea').cmd).toEqual('repeat');
    expect(InterpreterService.translate('repeat').cmd).toEqual('repeat');

    expect(InterpreterService.translate('re a').cmd).toEqual('unknown');
    expect(InterpreterService.translate('rep a').cmd).toEqual('unknown');
    expect(InterpreterService.translate('repe a').cmd).toEqual('unknown');
    expect(InterpreterService.translate('repea a').cmd).toEqual('unknown');
    expect(InterpreterService.translate('repeat a').cmd).toEqual('unknown');
  });

  test('Exit command', () => {
    expect(InterpreterService.translate('x').cmd).toEqual('exit');
    expect(InterpreterService.translate('ex').cmd).toEqual('exit');
    expect(InterpreterService.translate('exi').cmd).toEqual('exit');
    expect(InterpreterService.translate('exit').cmd).toEqual('exit');

    expect(InterpreterService.translate('x a').cmd).toEqual('unknown');
    expect(InterpreterService.translate('ex a').cmd).toEqual('unknown');
    expect(InterpreterService.translate('exi a').cmd).toEqual('unknown');
    expect(InterpreterService.translate('exit a').cmd).toEqual('unknown');
  });
});
