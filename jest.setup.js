import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { fetch, Headers, Request, Response } from 'cross-fetch'

// Mock global objects
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.fetch = fetch
global.Headers = Headers
global.Request = Request
global.Response = Response

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null }
  unobserve() { return null }
  disconnect() { return null }
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null }
  unobserve() { return null }
  disconnect() { return null }
} 