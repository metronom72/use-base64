import { describe, it, expect } from "vitest"
import { decodeBase64, decodeBase64ToBytes } from '../src/decode';
import { encodeBase64 } from '../src/encode';

// Since testing React hooks in isolation is complex,
// we'll test the underlying logic that the decode hooks use
describe("useBase64Decode underlying logic", () => {
  it("decodes basic strings correctly", () => {
    const result1 = decodeBase64("aGVsbG8=")
    const result2 = decodeBase64("d29ybGQ=")

    expect(result1).toBe("hello")
    expect(result2).toBe("world")
  })

  it("respects decoding options", () => {
    // Test bytes output
    const bytesResult = decodeBase64("aGVsbG8=", { output: "bytes" })
    expect(bytesResult).toBeInstanceOf(Uint8Array)
    expect(Array.from(bytesResult as Uint8Array)).toEqual([104, 101, 108, 108, 111])

    // Test string output (default)
    const stringResult = decodeBase64("aGVsbG8=", { output: "string" })
    expect(stringResult).toBe("hello")
  })

  it("handles empty strings", () => {
    expect(decodeBase64("")).toBe("")
    expect(decodeBase64("", { output: "bytes" })).toEqual(new Uint8Array(0))
  })

  it("handles null/undefined input gracefully (simulating hook behavior)", () => {
    // Simulate the null-coalescing behavior in useBase64Decode
    // @ts-ignore
    const safeInput = (null as any) ?? ""
    const result = decodeBase64(safeInput)
    expect(result).toBe("")
  })

  it("produces consistent results with same input", () => {
    const input = "aGVsbG8gd29ybGQ="
    const result1 = decodeBase64(input)
    const result2 = decodeBase64(input)

    // Should produce consistent results (simulating memoization benefit)
    expect(result1).toBe(result2)
    expect(result1).toBe("hello world")
  })

  it("validates dependency change scenarios", () => {
    const input = "dGVzdA=="

    // Same input, different options should give different results
    const stringResult = decodeBase64(input, { output: "string" })
    const bytesResult = decodeBase64(input, { output: "bytes" })
    const normalizedResult = decodeBase64(input, { normalize: "NFC" })

    expect(stringResult).toBe("test")
    expect(bytesResult).toBeInstanceOf(Uint8Array)
    expect(normalizedResult).toBe("test")
  })

  it("handles invalid base64 gracefully", () => {
    // Test error handling scenarios that hooks should handle gracefully
    expect(() => decodeBase64("invalid!!!")).toThrow()
    expect(() => decodeBase64("Y")).toThrow() // Invalid length
  })

  it("handles unicode content", () => {
    // Test unicode decoding with normalization
    const unicodeBase64 = "0J/RgNC40LLQtdGC" // "Привет"
    const result = decodeBase64(unicodeBase64, { normalize: "NFC" })

    expect(typeof result).toBe("string")
    expect(result.length).toBeGreaterThan(0)
  })

  it("round-trip consistency check", () => {
    const originalStrings = [
      "simple",
      "with spaces",
      "special!@#$%^&*()",
      "unicode: 🚀🔥💻",
      "Кириллица",
      ""
    ]

    originalStrings.forEach(original => {
      const encoded = encodeBase64(original)
      const decoded = decodeBase64(encoded)
      expect(decoded).toBe(original)
    })
  })

  it("handles safe decode scenarios", () => {
    // Valid decode
    try {
      const result = decodeBase64("aGVsbG8=")
      expect(result).toBe("hello")
    } catch (error) {
      expect(error).toBeNull() // Should not throw
    }

    // Invalid decode should throw (hooks will catch this)
    expect(() => decodeBase64("invalid")).toThrow()
  })

  it("validates byte array decoding", () => {
    const testCases = [
      { input: "YQ==", expected: [97] }, // "a"
      { input: "YWI=", expected: [97, 98] }, // "ab"
      { input: "YWJj", expected: [97, 98, 99] }, // "abc"
      { input: "", expected: [] } // empty
    ]

    testCases.forEach(({ input, expected }) => {
      const result = decodeBase64ToBytes(input)
      expect(Array.from(result)).toEqual(expected)
    })
  })
})