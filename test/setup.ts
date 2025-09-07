// Test setup file for Vitest
import { beforeAll, afterEach } from 'vitest'

// Setup global test environment
beforeAll(() => {
  // Ensure we have a clean global environment
  if (typeof globalThis.TextEncoder === 'undefined') {
    globalThis.TextEncoder = TextEncoder
    globalThis.TextDecoder = TextDecoder
  }
})

// Cleanup after each test
afterEach(() => {
  // Reset any global mocks or state if needed
})