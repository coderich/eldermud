import { translate } from '../../src/service/command.service';

describe('CommandService:translate', () => {
  test('Attack command', () => {
    expect(translate('a').name).toEqual('attack');
    expect(translate('at').name).toEqual('attack');
    expect(translate('att').name).toEqual('attack');
    expect(translate('atta').name).toEqual('attack');
    expect(translate('attac').name).toEqual('attack');
    expect(translate('attack').name).toEqual('attack');

    expect(translate('a bird').name).toEqual('attack');
    expect(translate('at bird').name).toEqual('attack');
    expect(translate('att bird').name).toEqual('attack');
    expect(translate('atta bird').name).toEqual('attack');
    expect(translate('attac bird').name).toEqual('attack');
    expect(translate('attack bird').name).toEqual('attack');

    expect(translate('attacks').name).toEqual('unknown');
    expect(translate('a bird is singing songs').name).toEqual('unknown');
  });

  test('North command', () => {
    expect(translate('n').name).toEqual('north');
    expect(translate('no').name).toEqual('north');
    expect(translate('nor').name).toEqual('north');
    expect(translate('nort').name).toEqual('north');
    expect(translate('north').name).toEqual('north');

    expect(translate('n a').name).toEqual('unknown');
    expect(translate('no a').name).toEqual('unknown');
    expect(translate('nor a').name).toEqual('unknown');
    expect(translate('nort a').name).toEqual('unknown');
    expect(translate('north a').name).toEqual('unknown');
  });

  test('Repeat command', () => {
    expect(translate('r').name).toEqual('unknown');
    expect(translate('re').name).toEqual('repeat');
    expect(translate('rep').name).toEqual('repeat');
    expect(translate('repe').name).toEqual('repeat');
    expect(translate('repea').name).toEqual('repeat');
    expect(translate('repeat').name).toEqual('repeat');

    expect(translate('re a').name).toEqual('unknown');
    expect(translate('rep a').name).toEqual('unknown');
    expect(translate('repe a').name).toEqual('unknown');
    expect(translate('repea a').name).toEqual('unknown');
    expect(translate('repeat a').name).toEqual('unknown');
  });

  test('Exit command', () => {
    expect(translate('x').name).toEqual('exit');
    expect(translate('ex').name).toEqual('exit');
    expect(translate('exi').name).toEqual('exit');
    expect(translate('exit').name).toEqual('exit');

    expect(translate('x a').name).toEqual('unknown');
    expect(translate('ex a').name).toEqual('unknown');
    expect(translate('exi a').name).toEqual('unknown');
    expect(translate('exit a').name).toEqual('unknown');
  });
});
