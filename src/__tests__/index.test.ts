import { readFileSync } from 'fs';
import { join } from 'path';

import { ensureString } from '..';

describe('ensureString', () => {
  it('should not change string', () => {
    expect(ensureString('abc')).toBe('abc');
  });

  it.each([['utf8'], ['utf8bom'], ['utf16le'], ['utf16be']])(
    'should convert Buffer (%s)',
    (filename) => {
      const expected = 'ABC🫕';
      const blob = readFileSync(join(__dirname, `test-${filename}.txt`));
      expect(ensureString(blob)).toStrictEqual(expected);
    },
  );

  it('should convert ArrayBuffer', () => {
    const buffer = new ArrayBuffer(3);
    const view = new Int8Array(buffer);
    view[0] = 65;
    view[1] = 66;
    view[2] = 67;
    expect(ensureString(buffer)).toBe('ABC');
  });

  it('should convert typed array', () => {
    const blob = new Int8Array(3);
    blob[0] = 65;
    blob[1] = 66;
    blob[2] = 67;
    expect(ensureString(blob)).toBe('ABC');
  });

  it('should convert latin1', () => {
    const blob = readFileSync(join(__dirname, 'test-latin1.txt'));
    expect(ensureString(ensureString(blob))).toBe('°C\n');
  });

  it('should work with less than two bytes', () => {
    expect(ensureString(Uint8Array.of(65))).toBe('A');
    expect(ensureString(new Uint8Array(0))).toBe('');
  });

  it.each([[{}], [[]], [new Date()], [true]])(
    'should throw for wrong types',
    (param) => {
      // @ts-expect-error
      expect(() => ensureString(param)).toThrow(TypeError);
    },
  );
});
