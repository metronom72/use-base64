import { utf8Encode } from "./env"
import { wrapAt } from "./wrap"
import { Base64Options } from './types';

const B64_STD = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
const B64_URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

/**
 * Encodes a byte array to Base64 string
 */
export function encodeBase64FromBytes(bytes: Uint8Array, options?: Base64Options): string {
  const table = (options?.variant === "url") ? B64_URL : B64_STD
  let output = ""
  const len = bytes.length
  const chunkSize = 0x8000 // Process in chunks to avoid stack overflow

  // Process complete 3-byte groups
  let i = 0
  while (i + 3 <= len) {
    const end = Math.min(i + chunkSize - (chunkSize % 3), len - (len % 3))
    output += encodeChunk(bytes, i, end, table)
    i = end
  }

  // Handle remaining 1-2 bytes with padding
  const rem = len - i
  if (rem > 0) {
    const a = bytes[i]
    const b = rem === 2 ? bytes[i + 1] : 0
    const triple = (a << 16) | (b << 8)
    output += table[(triple >> 18) & 63]
    output += table[(triple >> 12) & 63]
    if (rem === 2) {
      output += table[(triple >> 6) & 63]
      output += "="
    } else {
      output += "=="
    }
  }

  // Apply post-processing options
  if (options?.padding === "strip") output = output.replace(/=+$/u, "")
  if (options?.wrap && typeof options.wrap === "number") output = wrapAt(output, options.wrap)
  return output
}

/**
 * Encodes a complete 3-byte chunk efficiently
 */
function encodeChunk(bytes: Uint8Array, start: number, end: number, table: string): string {
  let out = ""
  for (let i = start; i < end; i += 3) {
    const triple = (bytes[i] << 16) | (bytes[i + 1] << 8) | (bytes[i + 2])
    out += table[(triple >> 18) & 63]
    out += table[(triple >> 12) & 63]
    out += table[(triple >> 6) & 63]
    out += table[triple & 63]
  }
  return out
}

/**
 * Encodes a string to Base64
 */
export function encodeBase64(input: string, options?: Base64Options): string {
  const bytes = utf8Encode(input, options?.normalize)
  return encodeBase64FromBytes(bytes, options)
}