"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  security: () => security
});
module.exports = __toCommonJS(index_exports);

// src/security/index.ts
var import_crypto = require("crypto");
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
    return (0, import_crypto.createHash)("sha256").update(data).digest("hex");
  }
  // Secure random token generation
  generateSecureToken(length = 32) {
    return (0, import_crypto.randomBytes)(length).toString("hex");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  security
});
//# sourceMappingURL=index.js.map