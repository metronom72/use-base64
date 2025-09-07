import { describe, it, expect } from "vitest"

describe("Library exports", () => {
  it("exports useBase64 hook", async () => {
    const { useBase64 } = await import("../src/hook")
    expect(typeof useBase64).toBe("function")
  })

  it("exports encoding functions", async () => {
    const { encodeBase64, encodeBase64FromBytes } = await import("../src/encode")
    expect(typeof encodeBase64).toBe("function")
    expect(typeof encodeBase64FromBytes).toBe("function")
  })

  it("exports decoding functions", async () => {
    const { decodeBase64, decodeBase64ToBytes } = await import("../src/decode")
    expect(typeof decodeBase64).toBe("function")
    expect(typeof decodeBase64ToBytes).toBe("function")
  })

  it("exports decode hooks", async () => {
    const {
      useBase64Decode,
      useBase64DecodeBytes,
      useBase64DecodeSafe
    } = await import("../src/decode-hook")
    expect(typeof useBase64Decode).toBe("function")
    expect(typeof useBase64DecodeBytes).toBe("function")
    expect(typeof useBase64DecodeSafe).toBe("function")
  })

  it("exports image hooks", async () => {
    const {
      useImageToBase64,
      useFileToBase64,
      useMultiFileToBase64,
      useAutoFileToBase64
    } = await import("../src/image-hook")
    expect(typeof useImageToBase64).toBe("function")
    expect(typeof useFileToBase64).toBe("function")
    expect(typeof useMultiFileToBase64).toBe("function")
    expect(typeof useAutoFileToBase64).toBe("function")
  })

  it("exports image utility functions", async () => {
    const {
      imageElementToBase64,
      fileToBase64,
      imageFileToBase64,
      canvasToBase64,
      imageDataToBase64,
      urlToBase64
    } = await import("../src/image")
    expect(typeof imageElementToBase64).toBe("function")
    expect(typeof fileToBase64).toBe("function")
    expect(typeof imageFileToBase64).toBe("function")
    expect(typeof canvasToBase64).toBe("function")
    expect(typeof imageDataToBase64).toBe("function")
    expect(typeof urlToBase64).toBe("function")
  })

  it("exports main library interface", async () => {
    const lib = await import("../src/index")

    // Encoding
    expect(typeof lib.useBase64).toBe("function")
    expect(typeof lib.encodeBase64).toBe("function")
    expect(typeof lib.encodeBase64FromBytes).toBe("function")

    // Decoding
    expect(typeof lib.decodeBase64).toBe("function")
    expect(typeof lib.decodeBase64ToBytes).toBe("function")
    expect(typeof lib.useBase64Decode).toBe("function")
    expect(typeof lib.useBase64DecodeBytes).toBe("function")
    expect(typeof lib.useBase64DecodeSafe).toBe("function")

    // Image utilities
    expect(typeof lib.useImageToBase64).toBe("function")
    expect(typeof lib.useFileToBase64).toBe("function")
    expect(typeof lib.useMultiFileToBase64).toBe("function")
    expect(typeof lib.useAutoFileToBase64).toBe("function")
    expect(typeof lib.imageElementToBase64).toBe("function")
    expect(typeof lib.fileToBase64).toBe("function")
    expect(typeof lib.imageFileToBase64).toBe("function")
    expect(typeof lib.canvasToBase64).toBe("function")
    expect(typeof lib.imageDataToBase64).toBe("function")
    expect(typeof lib.urlToBase64).toBe("function")
  })

  it("hook functions have correct arity", async () => {
    const { useBase64 } = await import("../src/hook")
    const { useBase64Decode } = await import("../src/decode-hook")

    // useBase64 should accept 1-2 parameters (input, options?)
    expect(useBase64.length).toBe(2)
    // useBase64Decode should accept 1-2 parameters (input, options?)
    expect(useBase64Decode.length).toBe(2)
  })

  it("exports type definitions", async () => {
    // Test that types can be imported (TypeScript compilation check)
    const types = await import("../src/index")

    // These should be available as types in TypeScript
    expect("UseBase64Options" in types).toBe(false) // Types don't exist at runtime
    expect("UseBase64DecodeOptions" in types).toBe(false)
    expect("ImageToBase64Options" in types).toBe(false)
    expect("FileToBase64Options" in types).toBe(false)
    expect("ImageFormat" in types).toBe(false)

    // But the functions should exist
    expect(typeof types.useBase64).toBe("function")
    expect(typeof types.useBase64Decode).toBe("function")
    expect(typeof types.useImageToBase64).toBe("function")
  })

  it("can perform round-trip encode/decode", async () => {
    const { encodeBase64, decodeBase64 } = await import("../src/index")

    const testString = "Hello, World! 🌍"
    const encoded = encodeBase64(testString)
    const decoded = decodeBase64(encoded)

    expect(decoded).toBe(testString)
  })

  it("can work with image data types", async () => {
    const { imageDataToBase64 } = await import("../src/index")

    const testData = new Uint8Array([1, 2, 3, 4])
    const result = imageDataToBase64(testData)

    expect(result).toMatch(/^data:image\/png;base64,/)
    expect(typeof result).toBe("string")
  })
})