# Neothink Platform Security Guide & Checklist

> **Proprietary Notice:**  
> This project and all related documentation are proprietary software owned and controlled by Neothink DAO and the Mark Hamilton Family. All rights reserved. Unauthorized use, distribution, or reproduction is strictly prohibited. See the [LICENSE](../../LICENSE) file for details.

This document provides a comprehensive overview of security best practices implemented across the Neothink Platform ecosystem. It serves as both a reference for current implementations and a checklist for ongoing security reviews. **It is intended for both users and admins: users should review authentication and personal security sections, while admins should use the full checklist for audits and continuous improvement.**

## Authentication & Authorization

### Implemented Security Measures

- [x] **JWT-based Authentication**: Secure token-based authentication with proper expiration and refresh mechanisms (via Supabase Auth)
- [x] **PKCE Flow**: Enhanced PKCE OAuth flow for secure authorization
- [x] **Row Level Security (RLS)**: Database-level security policies to restrict data access ([RLS Policy Documentation](./authorization.md))
- [x] **Role-Based Access Control (RBAC)**: Fine-grained permission system based on user roles ([RBAC Implementation](./RBAC-IMPLEMENTATION.md))
- [x] **Cross-Platform SSO**: Unified authentication across all platforms
- [x] **MFA Support**: Multi-factor authentication for enhanced security
- [x] **Secure Cookie Management**: HttpOnly, Secure, and SameSite=Strict flags for auth cookies
- [x] **Session Monitoring**: Real-time tracking of user sessions with suspicious activity detection
- [x] **Rate Limiting**: API rate limiting via shared middleware

See also: [Architecture Overview](../architecture/README.md), [Onboarding Guide](../getting-started/README.md), [Admin Guide](../admin/CONTINUOUS_IMPROVEMENT.md), [Troubleshooting](../troubleshooting/README.md), [Support](../support/README.md)

### Implementation Details

#### JWT Configuration

```typescript
// Example: Supabase client setup
const client = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  }
)
```

#### Row Level Security Policies

```sql
-- Example policy
CREATE POLICY "Users can view their own profile" 
  ON profiles 
  FOR SELECT 
  TO authenticated 
  USING (id = auth.uid());
```

#### Role-Based Permission Checking

```typescript
// Example: Permission check
export async function hasPermission(permission: string, tenantId?: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('has_permission', {
    _permission: permission,
    _tenant_id: tenantId
  });
  if (error) {
    console.error('Permission check failed:', error);
    return false;
  }
  return !!data;
}
```

## Data Protection

### Implemented Security Measures

- [x] **Input Validation**: Strict input validation using Zod schemas
- [x] **Output Sanitization**: Proper escaping of user-generated content
- [x] **Sensitive Data Encryption**: Encryption of PII and sensitive data at rest
- [x] **API Input Validation**: Comprehensive request validation for all API endpoints
- [x] **Database Query Parameterization**: Prevention of SQL injection
- [x] **CORS Configuration**: Strict cross-origin resource sharing policies
- [x] **Content Security Policy**: CSP headers to prevent XSS attacks
- [x] **File Upload Validation**: Strict validation of uploaded files

### Implementation Details

#### Input Validation with Zod

```typescript
import { z } from 'zod';
const SignupSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});
// Validate input
const validationResult = SignupSchema.safeParse(body);
if (!validationResult.success) {
  return NextResponse.json(
    { error: 'Validation failed', details: validationResult.error.flatten() },
    { status: 400 }
  );
}
```

#### Security Headers in Middleware

```typescript
function setSecurityHeaders(res: NextResponse): void {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    res.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' *.neothink.io *.vercel-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' *.supabase.co;"
    );
  }
}
```

## Infrastructure Security

### Implemented Security Measures

- [x] **Environment Variable Management**: Secure handling of environment variables
- [x] **Dependency Scanning**: Regular scanning for vulnerabilities in dependencies
- [x] **Secure Deployment Pipeline**: CI/CD with security checks
- [x] **Error Handling**: Properly structured error handling that doesn't leak sensitive information
- [x] **Logging and Monitoring**: Comprehensive security event logging
- [x] **Secure Communication**: HTTPS for all communications
- [x] **Database Backups**: Regular backups with secure storage
- [x] **Geo-Based Security**: Detection of suspicious logins from new locations

### Implementation Details

#### Security Event Logging

```typescript
export async function logSecurityEvent(
  action: string,
  details: Record<string, any> = {}
): Promise<void> {
  const supabase = createClient();
  try {
    await supabase.from('auth_logs').insert({
      action,
      details,
      ip_address: await getClientIp(),
      user_agent: window.navigator.userAgent,
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}
```

#### Database Function for Suspicious Login Detection

```sql
CREATE OR REPLACE FUNCTION check_suspicious_login(
  user_id UUID,
  ip_address TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  last_ip TEXT;
  is_suspicious BOOLEAN := FALSE;
BEGIN
  SELECT details->>'ip_address' INTO last_ip
  FROM auth_logs
  WHERE user_id = check_suspicious_login.user_id
    AND action = 'login_success'
    AND created_at > now() - interval '30 days'
  ORDER BY created_at DESC
  LIMIT 1;
  IF last_ip IS NOT NULL AND last_ip != ip_address THEN
    is_suspicious := EXISTS (
      SELECT 1 FROM profiles WHERE id = user_id AND is_guardian = TRUE
    );
  END IF;
  RETURN is_suspicious;
END;
$$ LANGUAGE plpgsql;
```

## Frontend Security

### Implemented Security Measures

- [x] **XSS Prevention**: Prevention of cross-site scripting via proper data escaping
- [x] **CSRF Protection**: Cross-site request forgery prevention
- [x] **Secure Component Design**: Security-focused component library
- [x] **Security-Focused React Hooks**: Custom hooks for secure data handling
- [x] **Safe HTML Rendering**: Secure rendering of user-generated content
- [x] **Client-Side Validation**: Form validation with security focus
- [x] **Security-Aware State Management**: Secure state management patterns
- [x] **Proper Error Boundaries**: React error boundaries to prevent crash-based information leaks

### Implementation Details

#### Safe HTML Rendering

```tsx
import DOMPurify from 'dompurify';
interface SafeHtmlProps {
  html: string;
  className?: string;
}
export function SafeHtml({ html, className }: SafeHtmlProps) {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
    />
  );
}
```

#### Security-Focused React Hook

```typescript
import { useState } from 'react';
import { z } from 'zod';
export function useSecureForm<T extends z.ZodType<any, any>>(schema: T) {
  const [data, setData] = useState<z.infer<T> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validate = (formData: unknown): boolean => {
    const result = schema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.errors.reduce((acc, error) => {
        const path = error.path.join('.');
        acc[path] = error.message;
        return acc;
      }, {} as Record<string, string>);
      setErrors(formattedErrors);
      return false;
    }
    setData(result.data);
    setErrors({});
    return true;
  };
  return { data, errors, validate };
}
```

## 🛡️ Security Checklist for Admins
- [ ] Review all implemented security measures quarterly ([Continuous Improvement](../admin/CONTINUOUS_IMPROVEMENT.md))
- [ ] Test authentication and RLS flows for all apps
- [ ] Review and update RLS and RBAC policies ([RLS Policy Documentation](./authorization.md), [RBAC Implementation](./RBAC-IMPLEMENTATION.md))
- [ ] Confirm all sensitive data is encrypted at rest and in transit
- [ ] Ensure all endpoints are rate-limited and monitored
- [ ] Review security headers and CSP on all deployed sites
- [ ] Run external vulnerability scans before launch
- [ ] Ensure all admins know how to report and respond to incidents ([Support](../support/README.md))

## 🔐 How to Report a Security Issue
- Users and admins should report vulnerabilities or suspicious activity via [Support](../support/README.md) or by contacting the core team directly (see [SECURITY.md](../../SECURITY.md)).

## 📚 Additional Resources
- [Security Guide](../security/security.md)
- [RLS Policy Documentation](./authorization.md)
- [RBAC Implementation](./RBAC-IMPLEMENTATION.md)
- [Data Protection](./data-protection.md)
- [Troubleshooting](../troubleshooting/README.md)
- [Support](../support/README.md)

---
> Security is a shared responsibility. All users and admins are empowered to help keep Neothink safe, resilient, and delightful.