import { describe, expect, it } from "vitest"
import { renderHook } from "@testing-library/react"

import {
  useBase64,
  useBase64Decode,
  useBase64DecodeBytes,
  useBase64DecodeSafe,
} from "../src/index"

const NON_CANONICAL = "aGVsbG9"

describe("useBase64", () => {
  it("кодирует вход", () => {
    const {result} = renderHook(() => useBase64("hello"))
    expect(result.current).toBe("aGVsbG8=")
  })

  it("учитывает options", () => {
    const {result} = renderHook(() =>
      useBase64("sure.", {variant: "url", padding: "strip"}),
    )
    expect(result.current).toBe("c3VyZS4")
  })

  it("пересчитывает при смене входа", () => {
    const {result, rerender} = renderHook(
      ({input}: {input: string}) => useBase64(input),
      {initialProps: {input: "hello"}},
    )
    expect(result.current).toBe("aGVsbG8=")
    rerender({input: "world"})
    expect(result.current).toBe("d29ybGQ=")
  })

  it("пересчитывает при смене variant", () => {
    const {result, rerender} = renderHook(
      ({variant}: {variant: "standard" | "url"}) =>
        useBase64("?>?", {variant}),
      {initialProps: {variant: "standard" as "standard" | "url"}},
    )
    const standard = result.current
    rerender({variant: "url"})
    expect(result.current).not.toBe(standard)
  })

  it("пустой вход не роняет хук", () => {
    const {result} = renderHook(() => useBase64(""))
    expect(result.current).toBe("")
  })
})

describe("useBase64Decode", () => {
  it("декодирует вход", () => {
    const {result} = renderHook(() => useBase64Decode("aGVsbG8="))
    expect(result.current).toBe("hello")
  })

  it("на негодном входе возвращает пустую строку, а не бросает", () => {
    const {result} = renderHook(() => useBase64Decode("!!!не base64!!!"))
    expect(result.current).toBe("")
  })

  it("output: bytes отдаёт Uint8Array", () => {
    const {result} = renderHook(() =>
      useBase64Decode("aGVsbG8=", {output: "bytes"}),
    )
    expect(result.current).toBeInstanceOf(Uint8Array)
    expect(Array.from(result.current as Uint8Array)).toEqual([
      104, 101, 108, 108, 111,
    ])
  })

  it("пересчитывает при смене output", () => {
    const {result, rerender} = renderHook(
      ({output}: {output: "string" | "bytes"}) =>
        useBase64Decode("aGVsbG8=", {output}),
      {initialProps: {output: "string" as "string" | "bytes"}},
    )
    expect(result.current).toBe("hello")
    rerender({output: "bytes"})
    expect(result.current).toBeInstanceOf(Uint8Array)
  })

  it("пересчитывает при смене loose", () => {
    const {result, rerender} = renderHook(
      ({loose}: {loose: boolean}) => useBase64Decode(NON_CANONICAL, {loose}),
      {initialProps: {loose: true}},
    )
    expect(result.current).toBe("hello")

    rerender({loose: false})
    expect(result.current).toBe("")

    rerender({loose: true})
    expect(result.current).toBe("hello")
  })
})

describe("useBase64DecodeBytes", () => {
  it("отдаёт байты", () => {
    const {result} = renderHook(() => useBase64DecodeBytes("aGVsbG8="))
    expect(Array.from(result.current)).toEqual([104, 101, 108, 108, 111])
  })

  it("на негодном входе отдаёт пустой массив", () => {
    const {result} = renderHook(() => useBase64DecodeBytes("!!!"))
    expect(result.current).toBeInstanceOf(Uint8Array)
    expect(result.current.length).toBe(0)
  })

  it("пересчитывает при смене входа", () => {
    const {result, rerender} = renderHook(
      ({input}: {input: string}) => useBase64DecodeBytes(input),
      {initialProps: {input: "aGVsbG8="}},
    )
    expect(Array.from(result.current)).toEqual([104, 101, 108, 108, 111])
    rerender({input: "d29ybGQ="})
    expect(Array.from(result.current)).toEqual([119, 111, 114, 108, 100])
  })
})

describe("useBase64DecodeSafe", () => {
  it("на годном входе: данные, без ошибки, isValid", () => {
    const {result} = renderHook(() => useBase64DecodeSafe("aGVsbG8="))
    expect(result.current.data).toBe("hello")
    expect(result.current.error).toBeNull()
    expect(result.current.isValid).toBe(true)
  })

  it("на негодном входе: сообщение об ошибке и isValid false", () => {
    const {result} = renderHook(() => useBase64DecodeSafe("!!!не base64!!!"))
    expect(result.current.data).toBe("")
    expect(result.current.error).toBeTruthy()
    expect(result.current.isValid).toBe(false)
  })

  it("пустой вход считается годным", () => {
    const {result} = renderHook(() => useBase64DecodeSafe(""))
    expect(result.current.error).toBeNull()
    expect(result.current.isValid).toBe(true)
  })

  it("пересчитывает при смене loose", () => {
    const {result, rerender} = renderHook(
      ({loose}: {loose: boolean}) =>
        useBase64DecodeSafe(NON_CANONICAL, {loose}),
      {initialProps: {loose: true}},
    )
    expect(result.current.isValid).toBe(true)
    expect(result.current.data).toBe("hello")

    rerender({loose: false})
    expect(result.current.isValid).toBe(false)
    expect(result.current.error).toBeTruthy()
  })
})
