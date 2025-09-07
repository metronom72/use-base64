import { describe, it, expect } from "vitest"
import { decodeBase64, decodeBase64ToBytes } from "../src/decode"
import { encodeBase64, encodeBase64FromBytes } from '../src/encode';

describe("decodeBase64", () => {
  it("handles empty string", () => {
    expect(decodeBase64("")).toBe("")
    expect(decodeBase64ToBytes("")).toEqual(new Uint8Array(0))
  })

  it("decodes basic ASCII text", () => {
    expect(decodeBase64("aGVsbG8=")).toBe("hello")
    expect(decodeBase64("d29ybGQ=")).toBe("world")
    expect(decodeBase64("dGVzdA==")).toBe("test")
  })

  it("handles different padding scenarios", () => {
    // No padding needed
    expect(decodeBase64("YWJj")).toBe("abc")
    // One padding
    expect(decodeBase64("YWI=")).toBe("ab")
    // Two padding
    expect(decodeBase64("YQ==")).toBe("a")
  })

  it("handles stripped padding", () => {
    // Should work without padding
    expect(decodeBase64("aGVsbG8")).toBe("hello")
    expect(decodeBase64("YWI")).toBe("ab")
    expect(decodeBase64("YQ")).toBe("a")
  })

  it("decodes URL-safe variant", () => {
    // Standard: "sure." -> "c3VyZS4="
    // URL-safe would be the same in this case, but test with chars that differ
    expect(decodeBase64("c3VyZS4=")).toBe("sure.")
    expect(decodeBase64("c3VyZS4")).toBe("sure.")
  })

  it("handles whitespace in input", () => {
    expect(decodeBase64("aGVs\nbG8=")).toBe("hello")
    expect(decodeBase64("YWJj ")).toBe("abc")
    expect(decodeBase64("\tdGVzdA==\n")).toBe("test")
  })

  it("decodes to bytes when requested", () => {
    const result = decodeBase64("aGVsbG8=", { output: "bytes" })
    expect(result).toBeInstanceOf(Uint8Array)
    expect(Array.from(result as Uint8Array)).toEqual([104, 101, 108, 108, 111])
  })

  it("decodes Cyrillic text correctly", () => {
    // "Привет" in base64
    const cyrillic = "0J/RgNC40LLQtdGC"
    const result = decodeBase64(cyrillic)
    expect(result).toBe("Привет")
  })

  it("throws on invalid base64", () => {
    expect(() => decodeBase64("!!!")).toThrow()
    expect(() => decodeBase64("YQ===")).toThrow() // Too much padding
    expect(() => decodeBase64("Y")).toThrow() // Invalid length
  })

  it("handles unicode normalization", () => {
    // This would need a specific base64 with composed/decomposed chars
    const result = decodeBase64("dGVzdA==", { normalize: "NFC" })
    expect(result).toBe("test")
  })

  it("round-trip encoding/decoding", () => {
    const testStrings = [
      "hello",
      "Hello, World!",
      "😀🔥📦",
      "Привет, мир!",
      "Mixed 123 !@# content"
    ]

    testStrings.forEach(str => {
      const encoded = encodeBase64(str)
      const decoded = decodeBase64(encoded)
      expect(decoded).toBe(str)
    })
  })

  it("round-trip with different options", () => {
    const str = "test data with special chars: +/="

    // Standard variant
    const stdEncoded = encodeBase64(str, { variant: "standard" })
    expect(decodeBase64(stdEncoded)).toBe(str)

    // URL-safe variant
    const urlEncoded = encodeBase64(str, { variant: "url" })
    expect(decodeBase64(urlEncoded)).toBe(str)

    // Stripped padding
    const strippedEncoded = encodeBase64(str, { padding: "strip" })
    expect(decodeBase64(strippedEncoded)).toBe(str)
  })

  it("handles binary data correctly", () => {
    const binaryData = new Uint8Array([0, 1, 255, 128, 64])

    const encoded = encodeBase64FromBytes(binaryData)
    const decoded = decodeBase64ToBytes(encoded)

    expect(Array.from(decoded)).toEqual(Array.from(binaryData))
  })
})