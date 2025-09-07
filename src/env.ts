export const hasTextEncoder = typeof TextEncoder !== "undefined"
export const hasTextDecoder = typeof TextDecoder !== "undefined"
export const hasBuffer = typeof globalThis !== "undefined" &&
  typeof (globalThis as any).Buffer !== "undefined" &&
  typeof (globalThis as any).Buffer.from === "function"

/**
 * Encodes a string to UTF-8 bytes using the best available method
 */
export function utf8Encode(input: string, normalize?: "NFC" | "NFD" | "NFKC" | "NFKD"): Uint8Array {
  const s = normalize ? input.normalize(normalize) : input
  if (hasTextEncoder) return new TextEncoder().encode(s)
  if (hasBuffer) return Uint8Array.from((globalThis as any).Buffer.from(s, "utf-8"))
  throw new Error("No UTF-8 encoder available in this environment")
}

/**
 * Decodes UTF-8 bytes to a string using the best available method
 */
export function utf8Decode(bytes: Uint8Array): string {
  if (hasTextDecoder) return new TextDecoder().decode(bytes)
  if (hasBuffer) return (globalThis as any).Buffer.from(bytes).toString("utf-8")
  throw new Error("No UTF-8 decoder available in this environment")
}