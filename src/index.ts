// Main exports for the library
export { useBase64 } from "./hook"
export { encodeBase64, encodeBase64FromBytes } from "./encode"
export { decodeBase64, decodeBase64ToBytes } from "./decode"
export {
  useBase64Decode,
  useBase64DecodeBytes,
  useBase64DecodeSafe
} from "./decode-hook"
export {
  useImageToBase64,
  useFileToBase64,
  useMultiFileToBase64,
  useAutoFileToBase64
} from "./image-hook"
export {
  imageElementToBase64,
  fileToBase64,
  imageFileToBase64,
  canvasToBase64,
  imageDataToBase64,
  urlToBase64
} from "./image"

// Export types
export type { Base64Options as UseBase64Options } from "./types"
export type { DecodeOptions as UseBase64DecodeOptions } from "./types"
export type {
  ImageToBase64Options,
  FileToBase64Options,
  ImageFormat,
  UseBase64State,
  UseBase64DecodeState,
  FileConversionResult
} from "./types"