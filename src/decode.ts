import { utf8Decode } from "./env"
import { DecodeOptions } from "./types"

/** Standard Base64 alphabet (RFC 4648, section 4) */
const B64_STD_ALPH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
/** URL-safe Base64 alphabet (RFC 4648, section 5) */
const B64_URL_ALPH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

/** Lookup tables mapping Base64 character -> 6-bit value */
const B64_STD_LOOKUP = createLookupTable(B64_STD_ALPH)
const B64_URL_LOOKUP = createLookupTable(B64_URL_ALPH)

/**
 * Build a lookup table for Base64 characters to indices (0..63).
 * @param alphabet - 64-character Base64 alphabet.
 * @returns A map from character to its 6-bit value.
 */
function createLookupTable(alphabet: string): Record<string, number> {
  const table: Record<string, number> = {}
  for (let i = 0; i < alphabet.length; i++) table[alphabet[i]] = i
  return table
}

/**
 * Encode raw bytes to Base64 using the provided alphabet.
 * Always returns a padded output (`=` or `==` when needed).
 *
 * NOTE: This is intentionally minimal and only used internally
 * for canonical verification after decoding inputs without padding.
 *
 * @param bytes - Raw bytes to encode.
 * @param alphabet - Base64 alphabet to use (standard or URL-safe).
 * @returns Base64 string with padding.
 */
function encodeBytesToBase64Raw(bytes: Uint8Array, alphabet: string): string {
  let out = ""
  let i = 0

  // Process input 3 bytes at a time -> 4 Base64 characters.
  while (i < bytes.length) {
    const a = bytes[i++] ?? 0
    const b = bytes[i++] ?? 0
    const c = bytes[i++] ?? 0

    const triplet = (a << 16) | (b << 8) | c
    const s0 = (triplet >>> 18) & 0x3f
    const s1 = (triplet >>> 12) & 0x3f
    const s2 = (triplet >>> 6) & 0x3f
    const s3 = triplet & 0x3f

    out += alphabet[s0] + alphabet[s1] + alphabet[s2] + alphabet[s3]
  }

  // Apply padding according to the remainder.
  const mod = bytes.length % 3
  if (mod === 1) {
    // Replace the last two characters with '=' to indicate 8 bits.
    out = out.slice(0, -2) + "=="
  } else if (mod === 2) {
    // Replace the last character with '=' to indicate 16 bits.
    out = out.slice(0, -1) + "="
  }

  return out
}

/**
 * Decode a Base64 string to bytes.
 *
 * Strict vs loose mode:
 * - Strict (default): Allows RFC 4648 no-padding inputs but *verifies canonical form*.
 *   If padding is missing, we re-encode decoded bytes (without '=') and compare to input.
 *   If they do not match exactly, we throw. Also validates `=` placement and alphabet.
 * - Loose: Auto-pads when length % 4 is 2 or 3 (fails only on 4k+1). Skips canonical check.
 *
 * URL-safe vs standard:
 * - The function detects URL-safe alphabet (`-`/`_`) vs standard (`+`/`/`).
 * - Mixing alphabets in a single string is rejected.
 *
 * Whitespace:
 * - All whitespace is stripped before processing.
 *
 * @param input - Base64 text (may be padded or no-padding form).
 * @param opts  - Decode options: `loose` to be lenient, etc.
 * @returns Decoded bytes as Uint8Array.
 * @throws Error on invalid input (bad length, bad padding, mixed alphabets, or non-canonical strict input).
 */
export function decodeBase64ToBytes(input: string, opts: DecodeOptions = {}): Uint8Array {
  // Empty input -> empty output
  if (!input) return new Uint8Array(0)

  // Remove any whitespace; RFC allows line wrapping
  const cleaned = input.replace(/\s+/g, "")

  // Detect which alphabet is used; reject if both are present
  const hasUrlChars = /[-_]/.test(cleaned)
  const hasStdChars = /[+/]/.test(cleaned)
  if (hasUrlChars && hasStdChars) {
    throw new Error("Mixed Base64 alphabets (standard and URL-safe)")
  }

  const isUrl = hasUrlChars
  const lookup = isUrl ? B64_URL_LOOKUP : B64_STD_LOOKUP
  const alph = isUrl ? B64_URL_ALPH : B64_STD_ALPH

  // Work with a local copy and track if canonical verification is needed
  let padded = cleaned
  const mod = padded.length % 4
  let verifyCanonical = false

  if (opts.loose) {
    // Loose mode: accept no-padding by simply adding '=' as needed.
    // Only 4k+1 is fundamentally invalid.
    if (mod === 1) throw new Error("Invalid Base64 string length")
    if (mod) padded += "=".repeat(4 - mod)
  } else {
    // Strict mode with RFC 4648 no-padding support.
    // We accept 4k+2 and 4k+3 by adding '=' for decoding,
    // BUT we will later verify that the input was canonical (no extra or missing chars).
    if (mod === 1) throw new Error("Invalid Base64 string length")

    if (mod === 2 || mod === 3) {
      padded += "=".repeat(4 - mod)
      verifyCanonical = true
    } else {
      // Length already multiple of 4: validate that '=' (if present) is only at the tail and is 1 or 2 chars long.
      const eqIdx = padded.indexOf("=")
      if (eqIdx !== -1) {
        const tail = padded.slice(eqIdx)
        if (!/^(=|==)$/.test(tail)) {
          throw new Error("Invalid Base64 padding")
        }
      }
    }
  }

  // Compute the decoded output length based on padding
  const len = padded.length
  const outputLen =
    (len / 4) * 3 - (padded.endsWith("==") ? 2 : padded.endsWith("=") ? 1 : 0)
  const output = new Uint8Array(outputLen)

  // Decode 4 Base64 chars -> 3 bytes
  let out = 0
  for (let i = 0; i < len; i += 4) {
    const a = lookup[padded[i]]
    const b = lookup[padded[i + 1]]
    const c = padded[i + 2] === "=" ? 0 : lookup[padded[i + 2]]
    const d = padded[i + 3] === "=" ? 0 : lookup[padded[i + 3]]

    // Any undefined means an invalid character for the chosen alphabet
    if (a === undefined || b === undefined || c === undefined || d === undefined) {
      throw new Error(`Invalid Base64 character at position ${i}`)
    }

    const triple = (a << 18) | (b << 12) | (c << 6) | d

    if (out < outputLen) output[out++] = (triple >> 16) & 0xff
    if (out < outputLen) output[out++] = (triple >> 8) & 0xff
    if (out < outputLen) output[out++] = triple & 0xff
  }

  // Canonical verification:
  // In strict mode when padding was stripped by the caller, ensure the input is a canonical no-padding form.
  // We re-encode the bytes and remove '='; the result must match exactly the original cleaned input.
  if (!opts.loose && verifyCanonical) {
    const reenc = encodeBytesToBase64Raw(output, alph).replace(/=+$/, "")
    if (reenc !== cleaned) {
      throw new Error("Invalid Base64 input (non-canonical without padding)")
    }
  }

  return output
}

/**
 * Decode a Base64 string to a UTF-8 string by default, or to bytes when `{ output: "bytes" }`.
 *
 * @param input - Base64 text (standard or URL-safe, may be padded or not).
 * @param options - Decoding options:
 *   - `output`: `"string"` (default) or `"bytes"`;
 *   - `normalize`: Unicode normalization form applied to string output;
 *   - `loose`: when `true`, be lenient about missing padding (no canonical check).
 * @returns Decoded string or Uint8Array depending on `output`.
 * @throws Error on invalid input (see `decodeBase64ToBytes`).
 */
export function decodeBase64(input: string, options?: DecodeOptions): string | Uint8Array {
  const bytes = decodeBase64ToBytes(input, options)

  // Return raw bytes if requested
  if (options?.output === "bytes") return bytes

  // Decode bytes as UTF-8 text
  const text = utf8Decode(bytes)

  // Optionally apply Unicode normalization
  return options?.normalize ? text.normalize(options.normalize) : text
}
