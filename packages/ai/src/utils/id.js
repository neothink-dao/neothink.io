/**
 * Generate a unique ID
 * @returns A unique ID string
 */
export function createId() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}
//# sourceMappingURL=id.js.map