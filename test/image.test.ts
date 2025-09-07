import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  imageDataToBase64,
  fileToBase64,
  canvasToBase64,
  imageElementToBase64,
  imageFileToBase64,
  urlToBase64
} from "../src/image"

// Mock canvas and image APIs for testing
const mockCanvas = {
  width: 0,
  height: 0,
  toDataURL: vi.fn().mockReturnValue("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="),
  getContext: vi.fn()
}

const mockContext = {
  drawImage: vi.fn()
}

const mockImage = {
  naturalWidth: 100,
  naturalHeight: 100,
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null,
  crossOrigin: "",
  src: ""
}

describe("Image utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock DOM APIs
    Object.defineProperty(globalThis, 'document', {
      value: {
        createElement: vi.fn((tag: string) => {
          if (tag === 'canvas') return mockCanvas
          return {}
        })
      },
      configurable: true
    })

    Object.defineProperty(globalThis, 'Image', {
      value: vi.fn(() => mockImage),
      configurable: true
    })

    Object.defineProperty(globalThis, 'URL', {
      value: {
        createObjectURL: vi.fn().mockReturnValue('blob:mock-url'),
        revokeObjectURL: vi.fn()
      },
      configurable: true
    })

    // Mock FileReader
    Object.defineProperty(globalThis, 'FileReader', {
      value: vi.fn(() => ({
        readAsDataURL: vi.fn(),
        onload: null,
        onerror: null,
        result: null
      })),
      configurable: true
    })

    // Setup canvas context mock
    mockCanvas.getContext.mockReturnValue(mockContext)
  })

  describe("imageDataToBase64", () => {
    it("converts byte array to base64 data URL", () => {
      const imageData = new Uint8Array([137, 80, 78, 71]) // PNG header
      const result = imageDataToBase64(imageData, "image/png")

      expect(result).toMatch(/^data:image\/png;base64,/)
      expect(result).toContain("iVBORw==") // Base64 encoded PNG header
    })

    it("returns raw base64 when format is 'base64'", () => {
      const imageData = new Uint8Array([137, 80, 78, 71])
      const result = imageDataToBase64(imageData, "image/png", { format: "base64" })

      expect(result).not.toContain("data:")
      expect(result).toBe("iVBORw==")
    })

    it("uses default mime type when not specified", () => {
      const imageData = new Uint8Array([1, 2, 3])
      const result = imageDataToBase64(imageData)

      expect(result).toMatch(/^data:image\/png;base64,/)
    })
  })

  describe("imageElementToBase64", () => {
    it("converts image element to data URL", () => {
      const result = imageElementToBase64(mockImage as any)

      expect(mockCanvas.width).toBe(100)
      expect(mockCanvas.height).toBe(100)
      expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, 0, 0, 100, 100)
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith("image/png", undefined)
      expect(result).toMatch(/^data:image\/png;base64,/)
    })

    it("returns raw base64 when format is 'base64'", () => {
      const result = imageElementToBase64(mockImage as any, { format: "base64" })

      expect(result).not.toContain("data:")
      expect(result).toBe("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==")
    })

    it("resizes image when maxWidth is specified", () => {
      imageElementToBase64(mockImage as any, { maxWidth: 50 })

      expect(mockCanvas.width).toBe(50)
      expect(mockCanvas.height).toBe(50) // Maintains aspect ratio
    })

    it("resizes image when maxHeight is specified", () => {
      // Set up rectangular image
      mockImage.naturalWidth = 200
      mockImage.naturalHeight = 100

      imageElementToBase64(mockImage as any, { maxHeight: 50 })

      expect(mockCanvas.width).toBe(100) // Scaled proportionally
      expect(mockCanvas.height).toBe(50)
    })

    it("uses specified image type and quality", () => {
      imageElementToBase64(mockImage as any, {
        type: "image/jpeg",
        quality: 0.8
      })

      expect(mockCanvas.toDataURL).toHaveBeenCalledWith("image/jpeg", 0.8)
    })
  })

  describe("canvasToBase64", () => {
    it("converts canvas to data URL", () => {
      const result = canvasToBase64(mockCanvas as any)

      expect(mockCanvas.toDataURL).toHaveBeenCalledWith("image/png", undefined)
      expect(result).toMatch(/^data:image\/png;base64,/)
    })

    it("returns raw base64 when format is 'base64'", () => {
      const result = canvasToBase64(mockCanvas as any, { format: "base64" })

      expect(result).not.toContain("data:")
    })
  })

  describe("fileToBase64", () => {
    it("reads file as data URL", async () => {
      // Create a mock FileReader instance
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null,
        result: "data:text/plain;base64,aGVsbG8="
      }

      // Mock the FileReader constructor
      const FileReaderMock = vi.fn(() => mockFileReader)
      Object.defineProperty(globalThis, 'FileReader', {
        value: FileReaderMock,
        configurable: true
      })

      const mockFile = new File(["hello"], "test.txt", { type: "text/plain" })
      const promise = fileToBase64(mockFile)

      // Simulate successful read
      setTimeout(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      }, 0)

      const result = await promise
      expect(result).toBe("data:text/plain;base64,aGVsbG8=")
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile)
    })

    it("returns raw base64 when format is 'base64'", async () => {
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null,
        result: "data:text/plain;base64,aGVsbG8="
      }

      Object.defineProperty(globalThis, 'FileReader', {
        value: vi.fn(() => mockFileReader),
        configurable: true
      })

      const mockFile = new File(["hello"], "test.txt", { type: "text/plain" })
      const promise = fileToBase64(mockFile, { format: "base64" })

      setTimeout(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      }, 0)

      const result = await promise
      expect(result).toBe("aGVsbG8=")
    })

    it("handles read errors", async () => {
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null,
        error: new Error("Read failed")
      }

      Object.defineProperty(globalThis, 'FileReader', {
        value: vi.fn(() => mockFileReader),
        configurable: true
      })

      const mockFile = new File(["hello"], "test.txt", { type: "text/plain" })
      const promise = fileToBase64(mockFile)

      setTimeout(() => {
        if (mockFileReader.onerror) {
          mockFileReader.onerror()
        }
      }, 0)

      await expect(promise).rejects.toBeDefined()
    })
  })

  describe("urlToBase64", () => {
    it("loads image from URL and converts to base64", async () => {
      const promise = urlToBase64("https://example.com/image.png")

      // Simulate successful image load
      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload()
        }
      }, 0)

      const result = await promise
      expect(mockImage.crossOrigin).toBe("anonymous")
      expect(mockImage.src).toBe("https://example.com/image.png")
      expect(result).toMatch(/^data:image\/png;base64,/)
    })

    it("handles image load errors", async () => {
      const promise = urlToBase64("https://example.com/broken.png")

      // Simulate error
      setTimeout(() => {
        if (mockImage.onerror) {
          mockImage.onerror()
        }
      }, 0)

      await expect(promise).rejects.toThrow("Failed to load image from URL")
    })
  })

  describe("imageFileToBase64", () => {
    it("rejects non-image files", async () => {
      const textFile = new File(["hello"], "test.txt", { type: "text/plain" })

      await expect(imageFileToBase64(textFile)).rejects.toThrow("File is not an image")
    })

    it("processes image file with resize options", async () => {
      const imageFile = new File(["fake-image"], "test.png", { type: "image/png" })
      const promise = imageFileToBase64(imageFile, { maxWidth: 50 })

      // Simulate successful image load
      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload()
        }
      }, 0)

      const result = await promise
      expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(imageFile)
      expect(globalThis.URL.revokeObjectURL).toHaveBeenCalled()
      expect(result).toMatch(/^data:image\/png;base64,/)
    })

    it("falls back to simple file reading when no resize options", async () => {
      // Mock FileReader for fallback
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null,
        result: "data:image/png;base64,fake-data"
      }

      Object.defineProperty(globalThis, 'FileReader', {
        value: vi.fn(() => mockFileReader),
        configurable: true
      })

      const imageFile = new File(["fake-image"], "test.png", { type: "image/png" })
      const promise = imageFileToBase64(imageFile)

      setTimeout(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      }, 0)

      const result = await promise
      expect(result).toBe("data:image/png;base64,fake-data")
    })
  })

  describe("Error handling", () => {
    it("throws error when canvas context is not available", () => {
      mockCanvas.getContext.mockReturnValue(null)

      expect(() => {
        imageElementToBase64(mockImage as any)
      }).toThrow("Could not get canvas 2D context")
    })
  })

  describe("Data URL parsing", () => {
    it("extracts base64 from data URL correctly", () => {
      const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
      const base64Index = dataUrl.indexOf(",") + 1
      const base64Part = dataUrl.substring(base64Index)

      expect(base64Part).toBe("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==")
      expect(base64Part).not.toContain("data:")
    })
  })
})