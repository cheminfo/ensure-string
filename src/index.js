/**
 * Ensure that the data is string. If it is an ArrayBuffer it will be converted to string using TextDecoder.
 * @param {string|ArrayBuffer} blob
 * @param {object} [options={}]
 * @param {string} [options.encoding='utf8']
 * @returns {string}
 */

export function ensureString(blob, options = {}) {
  const { encoding = 'utf8' } = options;
  if (ArrayBuffer.isView(blob) || blob instanceof ArrayBuffer) {
    const decoder = new TextDecoder(encoding);
    return decoder.decode(blob);
  }
  return blob;
}
