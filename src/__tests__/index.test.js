import { readFileSync } from 'fs';
import { join } from 'path';

import { ensureString } from '..';

describe('ensureString', () => {
  it('should not change string', () => {
    expect(ensureString('abc')).toStrictEqual('abc');
  });
  it('should convert ArrayBuffer', () => {
    const blob = readFileSync(join(__dirname, 'test.txt'));

    expect(ensureString(blob)).toStrictEqual('ABC');
  });
  it('should not convert text from file', () => {
    const text = readFileSync(join(__dirname, 'test.txt'), 'utf8');

    expect(ensureString(text)).toStrictEqual('ABC');
  });
});
