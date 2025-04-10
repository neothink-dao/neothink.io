# @neothink/auth

This package provides enhanced security features for Neothink applications, including middleware for authentication, rate limiting, and security logging.

## Features

### Security Middleware

The package includes a comprehensive middleware that handles:

- **Authentication** with JWT verification via Supabase
- **Platform detection** and access control
- **Rate limiting** for sensitive operations
- **CSRF protection** for mutation endpoints
- **Detailed security logging**
- **Advanced suspicious activity detection**
- **Comprehensive security headers**
- **Content Security Policy** with nonce-based script protection

### Security Headers

The middleware automatically applies the following security headers:

- **Content-Security-Policy (CSP)** - Strict CSP with nonce-based script execution
- **Strict-Transport-Security (HSTS)** - Forces HTTPS in production
- **X-Content-Type-Options** - Prevents MIME type sniffing
- **X-Frame-Options** - Prevents clickjacking
- **X-XSS-Protection** - Additional XSS protection
- **Referrer-Policy** - Controls referrer information
- **X-Permitted-Cross-Domain-Policies** - Restricts cross-domain policies

### Suspicious Activity Detection

The middleware includes advanced detection for:

- SQL injection attempts
- Cross-site scripting (XSS) attempts
- Path traversal attacks
- Suspicious user agents
- High request rates from single IPs
- Common exploit patterns

### Rate Limiting

Rate limiting is implemented with:

- Database-backed rate limit tracking
- Configurable limits per endpoint
- IP-based rate limiting
- Platform-specific limits
- Automatic cleanup of old entries

### Security Logging

All security events are logged to the database with:

- Event type and severity
- User ID (if authenticated)
- Request details (IP, path, method)
- Request headers
- Suspicious activity details
- Platform context

## Usage

### Basic Setup

1. Install the package:

```bash
npm install @neothink/auth
```

2. Add the middleware to your Next.js app:

```typescript
// middleware.ts
import { middleware } from '@neothink/auth';

export default middleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (robots.txt, sitemap.xml, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|assets/).*)',
  ],
};
```

### Database Tables

The package requires two database tables:

1. `security_events` - Stores security-related events
2. `rate_limits` - Tracks rate limiting data

These tables are automatically created when you run the migrations.

### Configuration

The middleware can be configured through environment variables:

```env
# Rate limiting
RATE_LIMIT_WINDOW=3600  # Time window in seconds
RATE_LIMIT_MAX=100      # Maximum requests per window

# Security
ENABLE_HSTS=true        # Enable HSTS in production
CSP_REPORT_URI=/api/csp # URI for CSP violation reports
```

### Customization

You can customize the security features by extending the middleware:

```typescript
import { middleware as baseMiddleware } from '@neothink/auth';

export async function middleware(req) {
  // Add custom logic before security checks
  
  // Call base middleware
  const response = await baseMiddleware(req);
  
  // Add custom logic after security checks
  
  return response;
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT 