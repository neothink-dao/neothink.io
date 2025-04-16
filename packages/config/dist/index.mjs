// src/env.ts
import { z } from "zod";
var envSchema = z.object({
  // Next.js
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  // App URLs
  NEXT_PUBLIC_HUB_URL: z.string().url(),
  NEXT_PUBLIC_ASCENDERS_URL: z.string().url(),
  NEXT_PUBLIC_NEOTHINKERS_URL: z.string().url(),
  NEXT_PUBLIC_IMMORTALS_URL: z.string().url(),
  // Auth
  NEXT_PUBLIC_AUTH_REDIRECT_URL: z.string().url(),
  // Optional: Email service (for future use)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional()
});
function validateEnv() {
  try {
    const env2 = envSchema.parse(process.env);
    return env2;
  } catch (error) {
    if (error instanceof z.ZodError) {
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
export {
  env,
  validateEnv
};
