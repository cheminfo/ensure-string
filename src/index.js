/**
 * Ensure that the data is string. If it is an ArrayBuffer it will be converted to string using TextDecoder.
 * @param {string|ArrayBuffer|ArrayBufferView} blob
 * @param {object} [options={}]
 * @param {string} [options.encoding] - Defaults to `utf-8` or automatic detection of `utf-16`.
 * @returns {string}
 */

export function ensureString(blob, options = {}) {
  if (typeof blob === 'string') {
    return blob;
  }
  if (ArrayBuffer.isView(blob) || blob instanceof ArrayBuffer) {
    const { encoding = guessEncoding(blob) } = options;
    const decoder = new TextDecoder(encoding);
    return decoder.decode(blob);
  }
  throw new TypeError(`blob must be a string, ArrayBuffer or ArrayBufferView`);
}

function guessEncoding(blob) {
  const uint8 = ArrayBuffer.isView(blob)
    ? new Uint8Array(blob.buffer, blob.byteOffset, blob.byteLength)
    : new Uint8Array(blob);
  if (uint8.length >= 2) {
    if (uint8[0] === 0xfe && uint8[1] === 0xff) {
      return 'utf-16be';
    }
    if (uint8[0] === 0xff && uint8[1] === 0xfe) {
      return 'utf-16le';
    }
  }
  return 'utf-8';
}
