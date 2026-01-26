import type { TextData } from 'cheminfo-types';

export interface EnsureStringOptions {
  /**
   * Specify the encoding, by default 'utf8' or 'utf16'
   * @default 'utf8' or utf16 if there is BOM utf16 or latin1 if it is not utf8
   */
  encoding?: string;
}

export type { TextData } from 'cheminfo-types';

/**
 * Ensure that the data is string. If it is an ArrayBuffer it will be converted to string using TextDecoder.
 * @param blob
 * @param options
 * @returns
 */
export function ensureString(
  blob: TextData,
  options: EnsureStringOptions = {},
): string {
  if (typeof blob === 'string') {
    return blob;
  }
  if (ArrayBuffer.isView(blob) || blob instanceof ArrayBuffer) {
    if (options.encoding) {
      return new TextDecoder(options.encoding).decode(blob);
    } else {
      return decodeText(blob);
    }
  }
  throw new TypeError(`blob must be a string, ArrayBuffer or ArrayBufferView`);
}

function decodeText(blob: ArrayBuffer | Uint8Array): string {
  const uint8 = ArrayBuffer.isView(blob)
    ? new Uint8Array(blob.buffer, blob.byteOffset, blob.byteLength)
    : new Uint8Array(blob);
  if (uint8.length >= 2) {
    if (uint8[0] === 0xfe && uint8[1] === 0xff) {
      return new TextDecoder('utf-16be').decode(uint8);
    }
    if (uint8[0] === 0xff && uint8[1] === 0xfe) {
      return new TextDecoder('utf-16le').decode(uint8);
    }
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(uint8);
  } catch {
    return new TextDecoder('latin1').decode(uint8);
  }
}
