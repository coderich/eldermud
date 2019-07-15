import { of } from 'rxjs';
import { writeStream } from '../../src/service/StreamService';

const timeout = ms => new Promise(res => setTimeout(res, ms));

describe('StreamService', () => {
  test('Simple example', () => {
    const fn1 = jest.fn(() => of('one'));
    const fn2 = jest.fn(() => of('two'));
    const fn3 = jest.fn(() => of('three'));

    writeStream('1', fn1);
    writeStream('2', fn2);
    writeStream('3', fn3);

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledTimes(1);
  });

  test('Same function called multiple times (diff streams)', () => {
    const fn1 = jest.fn(() => of('4 5 6'));

    writeStream('4', fn1);
    writeStream('5', fn1);
    writeStream('6', fn1);

    expect(fn1).toHaveBeenCalledTimes(3);
  });

  test('Same function called multiple times (same stream)', () => {
    const fn1 = jest.fn(() => of('seven'));

    writeStream('7', fn1);
    writeStream('7', fn1);
    writeStream('7', fn1);

    expect(fn1).toHaveBeenCalledTimes(3);
  });

  test('Async', async (done) => {
    const fn1 = jest.fn(() => of('eight'));

    writeStream('8', fn1);
    await timeout(1000);

    expect(fn1).toHaveBeenCalledTimes(1);
    done();
  });
});
