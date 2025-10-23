# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Liu Purnomo Blog API seriously. If you have discovered a security vulnerability, please follow these guidelines:

### Please DO NOT:
- Open a public GitHub issue for security vulnerabilities
- Discuss the vulnerability publicly until it has been addressed
- Exploit the vulnerability beyond the minimum necessary to demonstrate it

### Please DO:

1. **Email the security report to:** [liu@drone.co.id](mailto:liu@drone.co.id)
2. **Include the following information:**
   - Type of vulnerability (e.g., SQL injection, XSS, authentication bypass)
   - Full paths of source files related to the vulnerability
   - Location of the affected source code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the vulnerability and potential attack scenarios
   - Any suggested fixes (optional but appreciated)

### Response Timeline

- **Initial Response:** Within 48 hours of report submission
- **Status Update:** Within 7 days with assessment and expected timeline
- **Resolution:** Depends on severity and complexity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

### After Resolution

Once the vulnerability is fixed:

1. We will notify you that the issue has been resolved
2. We will prepare a security advisory
3. We will release a patch/update
4. We will publicly disclose the vulnerability (with your permission to credit you)

## Security Best Practices

When using this API, please follow these security practices:

### Authentication
- Never commit `.env` files or expose sensitive credentials
- Use strong, unique JWT secrets
- Rotate secrets regularly
- Implement rate limiting on authentication endpoints

### Database
- Use environment variables for database credentials
- Enable SSL/TLS for database connections in production
- Keep PostgreSQL updated to the latest stable version
- Regular database backups

### API Security
- Always use HTTPS in production
- Implement proper CORS policies
- Use helmet.js for security headers
- Validate and sanitize all user inputs
- Implement rate limiting on all endpoints

### Dependencies
- Regularly update npm dependencies
- Monitor security advisories: `npm audit`
- Use tools like Snyk or Dependabot for automated security updates

### Environment
- Never run the application as root
- Use proper file permissions
- Keep Node.js updated to LTS versions
- Implement proper logging and monitoring

## Security Updates

Security updates will be:
- Released as patch versions (e.g., 0.1.1 → 0.1.2)
- Documented in [CHANGELOG.md](./CHANGELOG.md)
- Announced in GitHub Security Advisories
- Sent to users who have enabled GitHub notifications

## Bug Bounty Program

We currently do not have a formal bug bounty program, but we deeply appreciate responsible disclosure of security vulnerabilities. Contributors who report valid security issues will be:

- Credited in the security advisory (with permission)
- Mentioned in the CHANGELOG
- Recognized as security contributors

## Security Hall of Fame

We will maintain a list of security researchers and contributors who have responsibly disclosed vulnerabilities:

<!-- This section will be updated as vulnerabilities are reported and resolved -->

*No security vulnerabilities have been reported yet.*

## Questions

If you have questions about this security policy, please contact [liu@drone.co.id](mailto:liu@drone.co.id)

---

Last updated: 2025-01-23
