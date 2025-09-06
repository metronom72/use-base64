import { describe, it, expect } from "vitest"
import { encodeBase64 } from "../src/encode"

// Reference implementation using Node.js Buffer (when available)
const hasBuffer = typeof globalThis !== "undefined" &&
  typeof (globalThis as any).Buffer !== "undefined" &&
  typeof (globalThis as any).Buffer.from === "function"

function refB64(s: string) {
  if (!hasBuffer) throw new Error("Buffer not available")
  return (globalThis as any).Buffer.from(s, "utf8").toString("base64")
}

describe("encodeBase64", () => {
  it("handles empty string", () => {
    expect(encodeBase64("")).toBe("")
  })

  it("encodes ASCII text correctly", () => {
    expect(encodeBase64("hello")).toBe(hasBuffer ? refB64("hello") : "aGVsbG8=")
  })

  it("encodes Cyrillic text correctly", () => {
    const s = "Привет, мир!"
    expect(encodeBase64(s)).toBe(hasBuffer ? refB64(s) : "0J/RgNC40LLQtdGCLCDQvNC40YAh")
  })

  it("encodes emoji correctly", () => {
    const s = "😀🔥📦 — test"
    const result = encodeBase64(s)
    if (hasBuffer) {
      expect(result).toBe(refB64(s))
    } else {
      expect(result).toBeTruthy() // Just ensure it doesn't throw
    }
  })

  it("supports URL-safe variant with padding stripped", () => {
    const s = "any+slash/plus?"
    const std = encodeBase64(s)
    const url = encodeBase64(s, { variant: "url", padding: "strip" })
    expect(url).toBe(std.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, ""))
  })

  it("supports line wrapping", () => {
    const s = "a".repeat(200)
    const wrapped = encodeBase64(s, { wrap: 76 })
    expect(wrapped.includes("\n")).toBe(true)
    expect(wrapped.replace(/\n/g, "")).toBe(encodeBase64(s))
  })

  it("handles single character correctly", () => {
    expect(encodeBase64("a")).toBe("YQ==")
  })

  it("handles two characters correctly", () => {
    expect(encodeBase64("ab")).toBe("YWI=")
  })

  it("handles three characters correctly", () => {
    expect(encodeBase64("abc")).toBe("YWJj")
  })
})