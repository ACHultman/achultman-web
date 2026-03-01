# Security Best Practices

This document outlines security considerations and best practices for maintaining and developing this application.

## Environment Variables

### Current Configuration
- ✅ Server-side variables protected from browser exposure
- ✅ Required variables validated at startup
- ⚠️ Gmail password stored in plain text

### Recommendations

1. **Use OAuth2 for Email**
   ```typescript
   // Instead of password authentication:
   auth: {
       type: 'OAuth2',
       user: process.env.NEXT_PUBLIC_EMAIL,
       clientId: process.env.GMAIL_CLIENT_ID,
       clientSecret: process.env.GMAIL_CLIENT_SECRET,
       refreshToken: process.env.GMAIL_REFRESH_TOKEN,
   }
   ```

2. **Rotate API Keys Regularly**
   - OpenAI API key: Rotate every 90 days
   - Notion API key: Rotate when team members leave
   - Email credentials: Use OAuth instead

3. **Never Commit Secrets**
   - Use `.env.local` for local development (gitignored)
   - Use Vercel environment variables for production
   - Scan commits with tools like `git-secrets`

## Input Validation & Sanitization

### Implemented Protections

1. **Contact Form**
   ```typescript
   // Email validation
   function isValidEmail(email: string): boolean {
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       return emailRegex.test(email);
   }

   // HTML escaping to prevent XSS
   function escapeHtml(text: string): string {
       const map = {
           '&': '&amp;',
           '<': '&lt;',
           '>': '&gt;',
           '"': '&quot;',
           "'": '&#039;',
       };
       return text.replace(/[&<>"']/g, char => map[char]);
   }

   // Length validation
   if (name.length > 100 || message.length > 5000) {
       return res.status(400).json({ message: 'Field length exceeded' });
   }
   ```

2. **Chat Input**
   - AI SDK handles sanitization automatically
   - Rate limiting prevents abuse
   - Input length limits should be added

### Recommendations

1. **Add Rate Limiting to Client-Side Forms**
   ```typescript
   // Prevent rapid form submissions
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [lastSubmit, setLastSubmit] = useState(0);

   const handleSubmit = async (e) => {
       if (Date.now() - lastSubmit < 5000) {
           return; // Prevent submission within 5 seconds
       }
       // ... submit logic
   };
   ```

2. **Implement CAPTCHA for Public Forms**
   - Consider reCAPTCHA v3 for contact form
   - Prevents automated spam submissions
   - Low friction for legitimate users

## API Security

### Current Protections

1. **Rate Limiting** (via middleware)
   ```typescript
   // 5 requests per 10 seconds per IP
   const ratelimit = new Ratelimit({
       redis: kv,
       limiter: Ratelimit.slidingWindow(5, '10 s'),
   });
   ```

2. **Method Validation**
   ```typescript
   if (req.method !== 'POST') {
       res.setHeader('Allow', ['POST']);
       return res.status(405).json({ message: 'Method not allowed' });
   }
   ```

3. **Error Handling**
   - Generic error messages to avoid information disclosure
   - Detailed errors logged server-side only

### Recommendations

1. **Add CORS Headers**
   ```typescript
   // In next.config.ts
   async headers() {
       return [{
           source: '/api/:path*',
           headers: [
               { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
               { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
           ],
       }];
   }
   ```

2. **Implement Request Signing**
   - For sensitive API routes
   - HMAC-based signatures
   - Prevents request tampering

3. **Add API Versioning**
   - Current: `/api/v1/...` ✅
   - Maintain backward compatibility
   - Deprecate old versions gradually

## HTTP Security Headers

### Implemented Headers

```typescript
{
    'X-Content-Type-Options': 'nosniff',           // Prevents MIME sniffing
    'X-Frame-Options': 'DENY',                      // Prevents clickjacking
    'X-XSS-Protection': '1; mode=block',            // XSS filter
    'Referrer-Policy': 'strict-origin-when-cross-origin', // Privacy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', // Feature restrictions
}
```

### Recommended Additional Headers

1. **Content Security Policy (CSP)**
   ```typescript
   {
       key: 'Content-Security-Policy',
       value: [
           "default-src 'self'",
           "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com",
           "style-src 'self' 'unsafe-inline'",
           "img-src 'self' data: https:",
           "font-src 'self' data:",
           "connect-src 'self' *.openai.com *.notion.so",
       ].join('; '),
   }
   ```
   
   **Note**: CSP is complex with Emotion (CSS-in-JS). May require:
   - Using nonces for inline styles
   - Configuring Emotion for nonce support
   - Testing thoroughly

2. **Strict-Transport-Security (HSTS)**
   ```typescript
   {
       key: 'Strict-Transport-Security',
       value: 'max-age=31536000; includeSubDomains; preload',
   }
   ```
   **Note**: Only add after confirming HTTPS works correctly

## Dependency Security

### Current Status
- 33 vulnerabilities in npm audit
- Most in dev dependencies (puppeteer, playwright, lighthouse)
- 2 critical vulnerabilities

### Recommendations

1. **Regular Audits**
   ```bash
   # Weekly security audit
   npm audit --production

   # Fix non-breaking issues
   npm audit fix

   # Review breaking changes manually
   npm audit fix --force  # Use with caution
   ```

2. **Automated Dependency Updates**
   - Use Dependabot (GitHub) or Renovate
   - Configure auto-merge for patch updates
   - Review minor/major updates manually

3. **Lock File Integrity**
   ```bash
   # Verify lockfile integrity
   npm ci  # In CI/CD, never use npm install

   # Update lockfile
   npm install --package-lock-only
   ```

4. **Remove Unused Dependencies**
   ```bash
   # Find unused dependencies
   npx depcheck

   # Remove them
   npm uninstall <package>
   ```

### Critical Vulnerabilities to Address

1. **basic-ftp** (CRITICAL - Path Traversal)
   - Source: Transitive dependency through `pa11y-ci`
   - Fix: Update to latest `pa11y-ci` or remove if not needed
   - Workaround: Puppeteer skip already configured

2. **playwright** (HIGH - Multiple CVEs)
   - Source: Direct dev dependency
   - Fix: Update to latest version
   - Command: `npm install --save-dev @playwright/test@latest`

## Data Privacy

### Current Practices

1. **Notion Data**
   - Fetched server-side only
   - API key never exposed to client
   - Cached appropriately (ISR)

2. **User Data**
   - Contact form: Name, email, message
   - Stored temporarily in email only
   - No database persistence

3. **Analytics**
   - Vercel Analytics (privacy-friendly)
   - Speed Insights (performance only)
   - No third-party tracking pixels

### Recommendations

1. **Add Privacy Policy**
   - Required if collecting any user data
   - Explain data collection (email, analytics)
   - Detail data retention policies
   - Provide contact for data requests

2. **Cookie Consent** (if needed)
   - Currently minimal cookies (Chakra UI theme)
   - May be required in EU (GDPR)
   - Consider cookie consent banner

3. **Data Retention**
   - Email submissions: Define retention period
   - Consider automated deletion
   - Document in privacy policy

## Authentication & Authorization

### Current Status
- No user authentication
- Public website with public content
- Admin functions (Notion) handled externally

### If Adding Authentication in Future

1. **Use Industry Standard Solutions**
   - NextAuth.js for Next.js apps
   - Auth0, Clerk, or Supabase Auth
   - Avoid building custom auth

2. **Implement Proper Session Management**
   ```typescript
   // Use HTTP-only cookies
   const sessionCookie = {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'lax',
       maxAge: 60 * 60 * 24 * 7, // 1 week
   };
   ```

3. **Add CSRF Protection**
   ```typescript
   // Use CSRF tokens for state-changing operations
   import { csrfToken } from 'next-auth/react';
   ```

## Deployment Security

### Vercel Best Practices

1. **Environment Variables**
   - Use Vercel dashboard for secrets
   - Different values per environment
   - Never in code or git

2. **Branch Protection**
   - Require PR reviews
   - Run CI checks before merge
   - Deploy previews for testing

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor API usage and rate limits
   - Alert on unusual traffic patterns

## Incident Response Plan

### If Security Issue Discovered

1. **Immediate Actions**
   - Disable affected functionality if critical
   - Rotate compromised credentials
   - Assess scope of breach

2. **Investigation**
   - Check logs for unauthorized access
   - Identify affected users/data
   - Document timeline of events

3. **Remediation**
   - Fix vulnerability
   - Deploy patch immediately
   - Test fix thoroughly

4. **Communication**
   - Notify affected users if needed
   - Document incident in security log
   - Update security practices

## Security Checklist for New Features

Before deploying new features:

- [ ] Input validation on all user inputs
- [ ] Output encoding/escaping for display
- [ ] Authentication/authorization checks if needed
- [ ] Rate limiting for API endpoints
- [ ] Error handling without information disclosure
- [ ] Dependency security scan
- [ ] Code review focusing on security
- [ ] Test with malicious inputs
- [ ] Update this document if new patterns added

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [Vercel Security](https://vercel.com/docs/security)

## Contact

For security concerns or to report vulnerabilities:
- Email: [Contact form on website]
- Responsible disclosure preferred
- Response within 48 hours

---

**Last Updated**: March 1, 2026  
**Next Review**: June 1, 2026 (Quarterly)
