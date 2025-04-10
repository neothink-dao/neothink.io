import { vi } from 'vitest';

// Mock global fetch
global.fetch = vi.fn();

// Mock crypto for tests
global.crypto = {
  getRandomValues: (buffer: Uint8Array) => {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  },
  subtle: {} as SubtleCrypto
} as Crypto;

// Mock process.env
process.env = {
  ...process.env,
  NODE_ENV: 'test'
}; 