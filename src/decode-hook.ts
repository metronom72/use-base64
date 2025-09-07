import { useMemo } from "react"
import { decodeBase64, decodeBase64ToBytes } from "./decode"
import { DecodeOptions } from './types';

/**
 * React hook for Base64 decoding with memoization
 * @param input - Base64 string to decode
 * @param options - Decoding options
 * @returns Decoded string or Uint8Array
 */
export function useBase64Decode(
  input: string,
  options?: DecodeOptions
): string | Uint8Array {
  const safeInput = input ?? ""

  // Dependency array with all option values to ensure proper memoization
  const deps: [string, DecodeOptions["output"]?, DecodeOptions["normalize"]?] = [
    safeInput,
    options?.output,
    options?.normalize
  ]

  return useMemo(() => {
    try {
      return decodeBase64(safeInput, options)
    } catch (error) {
      // Return empty result on decode error
      return options?.output === "bytes" ? new Uint8Array(0) : ""
    }
  }, deps)
}

/**
 * React hook specifically for decoding to bytes
 * @param input - Base64 string to decode
 * @returns Decoded Uint8Array
 */
export function useBase64DecodeBytes(input: string): Uint8Array {
  const safeInput = input ?? ""

  return useMemo(() => {
    try {
      return decodeBase64ToBytes(safeInput)
    } catch (error) {
      return new Uint8Array(0)
    }
  }, [safeInput])
}

/**
 * React hook for safe Base64 decoding with error handling
 * @param input - Base64 string to decode
 * @param options - Decoding options
 * @returns Object with decoded data and error state
 */
export function useBase64DecodeSafe(
  input: string,
  options?: DecodeOptions
): {
  data: string | Uint8Array
  error: string | null
  isValid: boolean
} {
  const safeInput = input ?? ""

  const deps: [string, DecodeOptions["output"]?, DecodeOptions["normalize"]?] = [
    safeInput,
    options?.output,
    options?.normalize
  ]

  return useMemo(() => {
    if (!safeInput) {
      return {
        data: options?.output === "bytes" ? new Uint8Array(0) : "",
        error: null,
        isValid: true
      }
    }

    try {
      const data = decodeBase64(safeInput, options)
      return {
        data,
        error: null,
        isValid: true
      }
    } catch (error) {
      return {
        data: options?.output === "bytes" ? new Uint8Array(0) : "",
        error: error instanceof Error ? error.message : "Decode failed",
        isValid: false
      }
    }
  }, deps)
}