const { timeout } = require('@coderich/util');
const Action = require('../src/Action');
const Stream = require('../src/Stream');

describe('Engine', () => {
  // Action parts
  const warmup = jest.fn(() => timeout(100).then(() => ({ warm: true })));
  const run = jest.fn(() => timeout(250).then(() => ({ ran: true })));
  const look = jest.fn(() => ({ looked: true }));
  const stretch = jest.fn(() => timeout(150).then(() => ({ stretched: true })));
  const abort = jest.fn((data, context) => context.abort());

  // Asserters
  const assertParameters = () => {
    expect(warmup).toHaveBeenCalledWith({ actor: 'me' }, { abort: expect.any(Function) });
    expect(run).toHaveBeenCalledWith({ warm: true }, { abort: expect.any(Function) });
    expect(look).toHaveBeenCalledWith({ ran: true }, { abort: expect.any(Function) });
    expect(stretch).toHaveBeenCalledWith({ looked: true }, { abort: expect.any(Function) });
  };

  const assertAbort = () => {
    expect(warmup).toHaveBeenCalled(); // It's going to get called
    expect(run).not.toHaveBeenCalled();
    expect(look).not.toHaveBeenCalled();
    expect(stretch).not.toHaveBeenCalled();
  };

  beforeEach(() => {
    warmup.mockClear();
    stretch.mockClear();
    look.mockClear();
    run.mockClear();
    abort.mockClear();
  });

  describe('Action', () => {
    test('define', () => {
      Action.define('compete', warmup, run, look, stretch);
      expect(Action.compete).toBeDefined();
    });

    test('parameters', async () => {
      await Action.compete({ actor: 'me' });
      assertParameters();
    });

    test('abort', async () => {
      const action = Action.compete({ actor: 'you' });
      action.abort();
      await (timeout(500));
      assertAbort();
    });

    test('inline abort', async () => {
      const action = new Action(run, abort, stretch);
      await action();
      expect(run).toHaveBeenCalled();
      expect(abort).toHaveBeenCalled();
      expect(stretch).not.toHaveBeenCalled();
    });
  });

  describe('Stream', () => {
    test('define', () => {
      Stream.define('test', () => {});
      expect(Stream.test).toBeDefined();
    });

    test('parameters', async () => {
      Stream.define('test', () => Action.compete({ actor: 'me' }));
      await timeout(500);
      assertParameters();
    });

    test('push', async () => {
      Stream.test.push(() => new Action(abort)(1));
      await timeout(50);
      expect(abort).toHaveBeenCalledWith(1, { abort: expect.any(Function) });
    });

    test('abort', async () => {
      const stream = new Stream(() => Action.compete({ actor: 'me' }));
      stream.abort();
      await timeout(500);
      assertAbort();
    });

    test('inline abort', async () => {
      Stream.define('test', () => new Action(run, abort, stretch)());
      await timeout(500);
      expect(run).toHaveBeenCalled();
      expect(abort).toHaveBeenCalled();
      expect(stretch).not.toHaveBeenCalled();
    });
  });
});
