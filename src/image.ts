import { encodeBase64FromBytes } from "./encode"
import {FileToBase64Options, ImageToBase64Options} from "./types";

/**
 * Converts an HTML image element to Base64
 */
export function imageElementToBase64(
  img: HTMLImageElement,
  options?: ImageToBase64Options
): string {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Could not get canvas 2D context")
  }

  // Calculate dimensions
  let { width, height } = calculateDimensions(
    img.naturalWidth,
    img.naturalHeight,
    options?.maxWidth,
    options?.maxHeight
  )

  canvas.width = width
  canvas.height = height

  // Draw image to canvas
  ctx.drawImage(img, 0, 0, width, height)

  // Get data URL
  const type = options?.type || "image/png"
  const quality = options?.quality
  const dataUrl = canvas.toDataURL(type, quality)

  if (options?.format === "base64") {
    // Extract base64 part from data URL
    const base64Index = dataUrl.indexOf(",") + 1
    return dataUrl.substring(base64Index)
  }

  return dataUrl
}

/**
 * Converts a File object to Base64
 */
export function fileToBase64(
  file: File,
  options?: FileToBase64Options
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result as string

      if (options?.format === "base64") {
        // Extract base64 part from data URL
        const base64Index = result.indexOf(",") + 1
        resolve(result.substring(base64Index))
      } else {
        resolve(result)
      }
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * Converts an image File to Base64 with resize options
 */
export function imageFileToBase64(
  file: File,
  options?: ImageToBase64Options
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      reject(new Error("File is not an image"))
      return
    }

    // If no resize options, use simple file reading
    if (!options?.maxWidth && !options?.maxHeight && !options?.type && !options?.quality) {
      fileToBase64(file, { format: options?.format }).then(resolve).catch(reject)
      return
    }

    // Create image element for resizing
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      try {
        const result = imageElementToBase64(img, options)
        resolve(result)
      } catch (error) {
        reject(error)
      } finally {
        URL.revokeObjectURL(url)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }

    img.src = url
  })
}

/**
 * Converts canvas element to Base64
 */
export function canvasToBase64(
  canvas: HTMLCanvasElement,
  options?: ImageToBase64Options
): string {
  const type = options?.type || "image/png"
  const quality = options?.quality
  const dataUrl = canvas.toDataURL(type, quality)

  if (options?.format === "base64") {
    const base64Index = dataUrl.indexOf(",") + 1
    return dataUrl.substring(base64Index)
  }

  return dataUrl
}

/**
 * Converts Uint8Array image data to Base64
 */
export function imageDataToBase64(
  imageData: Uint8Array,
  mimeType: string = "image/png",
  options?: Pick<ImageToBase64Options, "format">
): string {
  const base64 = encodeBase64FromBytes(imageData)

  if (options?.format === "base64") {
    return base64
  }

  return `data:${mimeType};base64,${base64}`
}

/**
 * Loads an image from URL and converts to Base64
 */
export function urlToBase64(
  url: string,
  options?: ImageToBase64Options
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    // Handle CORS
    img.crossOrigin = "anonymous"

    img.onload = () => {
      try {
        const result = imageElementToBase64(img, options)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => reject(new Error("Failed to load image from URL"))
    img.src = url
  })
}

/**
 * Calculate dimensions maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number,
  maxHeight?: number
): { width: number; height: number } {
  let width = originalWidth
  let height = originalHeight

  if (maxWidth && width > maxWidth) {
    height = (height * maxWidth) / width
    width = maxWidth
  }

  if (maxHeight && height > maxHeight) {
    width = (width * maxHeight) / height
    height = maxHeight
  }

  return { width: Math.round(width), height: Math.round(height) }
}