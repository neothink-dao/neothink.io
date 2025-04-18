import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
// Mock global fetch
global.fetch = vi.fn();
// Mock crypto for tests
global.crypto = {
    getRandomValues: (buffer) => {
        for (let i = 0; i < buffer.length; i++) {
            buffer[i] = Math.floor(Math.random() * 256);
        }
        return buffer;
    },
    subtle: {}
};
// Mock process.env
process.env = Object.assign(Object.assign({}, process.env), { NODE_ENV: 'test' });
//# sourceMappingURL=setup.js.map