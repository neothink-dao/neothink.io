// src/security/index.ts
import { createHash, randomBytes } from "crypto";
var SecurityService = class _SecurityService {
  constructor(config) {
    this.config = config;
  }
  static getInstance(config) {
    if (!_SecurityService.instance) {
      _SecurityService.instance = new _SecurityService(config);
    }
    return _SecurityService.instance;
  }
  // Input validation and sanitization
  sanitizeUserInput(input) {
    throw new Error("sanitizeUserInput not implemented.");
  }
  // Rate limiting
  getRateLimiter() {
    throw new Error("getRateLimiter not implemented.");
  }
  // Token validation
  validateAuthToken(token) {
    throw new Error("validateAuthToken not implemented.");
  }
  // Data encryption
  encryptSensitiveData(data) {
    throw new Error("encryptSensitiveData not implemented.");
  }
  decryptSensitiveData(encryptedData) {
    throw new Error("decryptSensitiveData not implemented.");
  }
  // Hash generation
  generateHash(data) {
    return createHash("sha256").update(data).digest("hex");
  }
  // Secure random token generation
  generateSecureToken(length = 32) {
    return randomBytes(length).toString("hex");
  }
  // Security headers
  getSecurityHeaders() {
    return {
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Content-Security-Policy": this.getCSP(),
      "Permissions-Policy": this.getPermissionsPolicy()
    };
  }
  getCSP() {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.segment.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.segment.io",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join("; ");
  }
  getPermissionsPolicy() {
    return [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()"
    ].join(", ");
  }
  // Compliance checks
  validateDataPrivacy(data) {
    const sensitiveFields = ["ssn", "creditCard", "password"];
    return !Object.keys(data).some((key) => sensitiveFields.includes(key));
  }
  // Security logging
  logSecurityEvent(event, details) {
    console.log("[SECURITY]", {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      event,
      details
    });
  }
};
var security = SecurityService.getInstance({
  rateLimitRequests: 100,
  rateLimitWindowMs: 15 * 60 * 1e3,
  // 15 minutes
  encryptionKey: process.env.ENCRYPTION_KEY || "",
  jwtSecret: process.env.JWT_SECRET || ""
});
export {
  security
};
//# sourceMappingURL=index.mjs.map