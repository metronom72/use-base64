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

  it("exports main library interface", async () => {
    const lib = await import("../src/index")
    expect(typeof lib.useBase64).toBe("function")
    expect(typeof lib.encodeBase64).toBe("function")
    expect(typeof lib.encodeBase64FromBytes).toBe("function")
  })

  it("hook function has correct arity", async () => {
    const { useBase64 } = await import("../src/hook")
    // useBase64 should accept 1-2 parameters (input, options?)
    expect(useBase64.length).toBe(2)
  })
})