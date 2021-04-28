import { readFileSync } from 'fs';
import { join } from 'path';

import { ensureString } from '..';

describe('ensureString', () => {
  it('should not change string', () => {
    expect(ensureString('abc')).toStrictEqual('abc');
  });
  it('should convert Buffer', () => {
    const blob = readFileSync(join(__dirname, 'test.txt'));

    expect(ensureString(blob)).toStrictEqual('ABC');
  });
  it('should convert ArrayBuffer', () => {
    const buffer = new ArrayBuffer(3);
    const view = new Int8Array(buffer);
    view[0] = 65;
    view[1] = 66;
    view[2] = 67;
    expect(ensureString(buffer)).toStrictEqual('ABC');
  });
  it('should convert typed array', () => {
    const blob = new Int8Array(3);
    blob[0] = 65;
    blob[1] = 66;
    blob[2] = 67;
    expect(ensureString(blob)).toStrictEqual('ABC');
  });
  it('should not convert text from file', () => {
    const text = readFileSync(join(__dirname, 'test.txt'), 'utf8');

    expect(ensureString(text)).toStrictEqual('ABC');
  });
});
