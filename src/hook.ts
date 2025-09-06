import { useMemo } from "react"
import { encodeBase64, type Options } from "./encode"

/**
 * React hook for Base64 encoding with memoization
 * @param input - String to encode
 * @param options - Encoding options
 * @returns Base64 encoded string
 */
export function useBase64(input: string, options?: Options): string {
  const safeInput = input ?? ""

  // Dependency array with all option values to ensure proper memoization
  const deps: [string, Options["variant"]?, Options["padding"]?, Options["wrap"]?, Options["normalize"]?] = [
    safeInput,
    options?.variant,
    options?.padding,
    options?.wrap,
    options?.normalize
  ]

  return useMemo(() => encodeBase64(safeInput, options), deps)
}

export type { Options as UseBase64Options }