import { useMemo } from "react"
import { encodeBase64 } from "./encode"
import { Base64Options } from './types';

/**
 * React hook for Base64 encoding with memoization
 * @param input - String to encode
 * @param options - Encoding options
 * @returns Base64 encoded string
 */
export function useBase64(input: string, options?: Base64Options): string {
  const safeInput = input ?? ""

  // Dependency array with all option values to ensure proper memoization
  const deps: [string, Base64Options["variant"]?, Base64Options["padding"]?, Base64Options["wrap"]?, Base64Options["normalize"]?] = [
    safeInput,
    options?.variant,
    options?.padding,
    options?.wrap,
    options?.normalize
  ]

  return useMemo(() => encodeBase64(safeInput, options), deps)
}