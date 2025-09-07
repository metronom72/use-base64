// Central type definitions for the library

export type Base64Variant = "standard" | "url"
export type PaddingOption = "preserve" | "strip"
export type UnicodeNormalization = "NFC" | "NFD" | "NFKC" | "NFKD"
export type OutputFormat = "string" | "bytes"
export type ImageOutputFormat = "dataUrl" | "base64"

export type ImageFormat =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif"
  | "image/bmp"

// Base64 encoding options
export interface Base64Options {
  /** Base64 variant: standard (+/) or URL-safe (-_) */
  variant?: Base64Variant
  /** Padding behavior: preserve or strip trailing = */
  padding?: PaddingOption
  /** Line wrapping: false for no wrap, number for wrap width */
  wrap?: false | number
  /** Unicode normalization form */
  normalize?: UnicodeNormalization
}

// Base64 decoding options
export interface DecodeOptions {
  /** Output format: string or bytes */
  output?: OutputFormat
  /** Unicode normalization form for string output */
  normalize?: UnicodeNormalization
  /** Allow loose decoding: auto-pad and accept imperfect strings */
  loose?: boolean
}

// Image conversion options
export interface ImageToBase64Options {
  /** Output format: data URL or raw base64 */
  format?: ImageOutputFormat
  /** Image quality for lossy formats (0-1) */
  quality?: number
  /** Target image type (if different from source) */
  type?: ImageFormat
  /** Maximum width (maintains aspect ratio) */
  maxWidth?: number
  /** Maximum height (maintains aspect ratio) */
  maxHeight?: number
}

// File conversion options
export interface FileToBase64Options {
  /** Output format: data URL or raw base64 */
  format?: ImageOutputFormat
}

// Hook state interfaces
export interface UseBase64State {
  data: string | null
  loading: boolean
  error: string | null
}

export interface UseBase64DecodeState {
  data: string | Uint8Array
  error: string | null
  isValid: boolean
}

export interface FileConversionResult {
  file: File
  data: string | null
  error: string | null
}

export type UseImageToBase64State = {
  data: string | null
  loading: boolean
  error: string | null
}

export type UseImageToBase64Return = UseImageToBase64State & {
  convertFile: (file: File, options?: ImageToBase64Options) => Promise<void>
  convertUrl: (url: string, options?: ImageToBase64Options) => Promise<void>
  reset: () => void
}