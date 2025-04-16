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
  env: () => env,
  validateEnv: () => validateEnv
});
module.exports = __toCommonJS(index_exports);

// src/env.ts
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  // Next.js
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("development"),
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: import_zod.z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: import_zod.z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: import_zod.z.string().min(1),
  // App URLs
  NEXT_PUBLIC_HUB_URL: import_zod.z.string().url(),
  NEXT_PUBLIC_ASCENDERS_URL: import_zod.z.string().url(),
  NEXT_PUBLIC_NEOTHINKERS_URL: import_zod.z.string().url(),
  NEXT_PUBLIC_IMMORTALS_URL: import_zod.z.string().url(),
  // Auth
  NEXT_PUBLIC_AUTH_REDIRECT_URL: import_zod.z.string().url(),
  // Optional: Email service (for future use)
  SMTP_HOST: import_zod.z.string().optional(),
  SMTP_PORT: import_zod.z.string().optional(),
  SMTP_USER: import_zod.z.string().optional(),
  SMTP_PASSWORD: import_zod.z.string().optional(),
  SMTP_FROM: import_zod.z.string().email().optional()
});
function validateEnv() {
  try {
    const env2 = envSchema.parse(process.env);
    return env2;
  } catch (error) {
    if (error instanceof import_zod.z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join(".")).join(", ");
      throw new Error(
        `\u274C Invalid environment variables: ${missingVars}
${error.message}`
      );
    }
    throw error;
  }
}
var env = validateEnv();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  env,
  validateEnv
});
