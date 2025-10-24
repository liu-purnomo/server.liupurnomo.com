# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.0] - 2025-10-24

### Added
- **GitHub OAuth 2.0 Authentication** with smart user handling
  - Auto-registration for new users with verified email
  - Auto-verification for existing unverified users
  - Seamless login for existing verified users
  - Temporary password generation and email notification
  - Account linking with OAuth provider data
- **Forgot Password & Reset Password Feature**
  - `POST /api/auth/forgot-password` - Request password reset email
  - `POST /api/auth/reset-password` - Reset password with token
  - Secure reset token generation and validation
  - Email notification with reset instructions
  - Token expiration handling (1 hour)
- **GitHub OAuth Endpoints**
  - `GET /api/auth/github` - Initiate GitHub OAuth flow
  - `GET /api/auth/github/callback` - Handle GitHub OAuth callback
- **Passport.js GitHub Strategy**
  - GitHub OAuth Strategy configuration
  - Profile data mapping (username, bio, location)
  - Avatar URL handling
- **Email Templates**
  - GitHub OAuth welcome email with temporary password
  - Forgot password email with reset link
  - Reset password confirmation email
- **Types & Interfaces**
  - `GitHubProfile` - GitHub user profile interface
  - `GitHubOAuthUserData` - OAuth user data structure
  - `ForgotPasswordEmailData` - Forgot password email template data
  - `ResetPasswordEmailData` - Reset password email template data
- **Service Layer**
  - `githubAuth.service.ts` - Complete GitHub OAuth business logic
  - `forgotPassword()` - Forgot password service function
  - `resetPassword()` - Reset password service function
  - Reset token generation and validation
- **OpenAPI Documentation**
  - GitHub OAuth endpoint documentation
  - Forgot password endpoint documentation
  - Reset password endpoint documentation

### Fixed
- **Google OAuth Service** - Fixed ES module import issue
  - Changed from `require()` to ES6 `import` statement
  - Resolved "require is not defined" error in ESM context
- **GitHub OAuth Service** - Fixed ES module import issue
  - Changed from `require()` to ES6 `import` statement

### Changed
- Enhanced authentication system with password recovery
- Updated User model to support password reset tokens
- Improved email notification system

### Security
- Secure reset token generation with expiration
- Token validation with timestamp checking
- Password reset rate limiting

## [0.5.0] - 2025-10-24

### Added
- **Google OAuth 2.0 Authentication** with smart user handling
  - Auto-registration for new users with verified email
  - Auto-verification for existing unverified users
  - Seamless login for existing verified users
  - Temporary password generation and email notification
  - Account linking with OAuth provider data
- **OAuth Endpoints**
  - `GET /api/auth/google` - Initiate Google OAuth flow
  - `GET /api/auth/google/callback` - Handle Google OAuth callback
- **Passport.js Integration**
  - Google OAuth Strategy configuration
  - Session serialization/deserialization
  - Secure token handling
- **Email Template**
  - Google OAuth welcome email with temporary password
  - Instructions for password change
- **Types & Interfaces**
  - `GoogleProfile` - Google user profile interface
  - `GoogleOAuthUserData` - OAuth user data structure
  - `GoogleOAuthPasswordEmailData` - Email template data
  - Express type extensions for OAuth user data
- **Service Layer**
  - `googleAuth.service.ts` - Complete OAuth business logic
  - Random password generator with security requirements
  - Username generator from email
  - Smart user registration/login flow
- **OpenAPI Documentation**
  - Complete OAuth endpoint documentation
  - OAuth tag for better organization
  - Redirect flow documentation

### Changed
- Updated authentication features to include OAuth support
- Enhanced User model handling for OAuth accounts
- Improved type safety with Express type extensions

### Security
- Secure random password generation (16 chars, mixed case, numbers, special chars)
- Email-verified accounts by default for OAuth users
- Temporary password sent to user email
- OAuth token storage in Account model

## [0.4.0] - 2025-10-24

### Added
- **Complete Authentication System** with modern email-first flow
  - Email verification with 4-digit verification codes (15-minute expiry)
  - User registration with token verification
  - Login with email and password
  - Forgot password and password reset with secure tokens
  - Email verification and resend verification endpoints
  - Change password for authenticated users
  - Refresh token support for session management
  - Get current user profile endpoint
- **Authentication Endpoints** (11 total)
  - `POST /api/auth/check-email` - Check email existence and send verification code
  - `POST /api/auth/register` - Complete registration with verification token
  - `POST /api/auth/login` - Authenticate user
  - `POST /api/auth/forgot-password` - Request password reset
  - `POST /api/auth/reset-password` - Reset password with token
  - `POST /api/auth/verify-email` - Verify email address
  - `POST /api/auth/resend-verification` - Resend verification code
  - `POST /api/auth/refresh-token` - Refresh access token
  - `GET /api/auth/me` - Get current user (protected)
  - `POST /api/auth/change-password` - Change password (protected)
  - `POST /api/auth/logout` - Logout user (protected)
- **Bookmark System** for user content management
  - Bookmark model with note, tags, favorite, and read status
  - Relations to User and Post models
  - Indexes for optimal query performance
- **Authentication Middleware**
  - JWT authentication middleware with Bearer token support
  - Optional authentication for public endpoints
  - Role-based access control middleware
  - Email verification requirement middleware
- **Request Validation System**
  - Zod v4 validation schemas for all auth endpoints
  - Strong password validation (min 8 chars, mixed case, numbers, special chars)
  - Username validation (alphanumeric + underscore, 3-30 chars)
  - Validation middleware with detailed error messages
- **Email Templates** with professional HTML design
  - Registration verification email with 4-digit code
  - Email verification template
  - Password reset email with secure token
  - Welcome email after successful registration
  - Password changed confirmation email
  - Responsive design with gradient headers and styled components
- **Security Features**
  - Cryptographically secure 4-digit code generation using crypto.randomBytes
  - Bcrypt password hashing
  - JWT token encryption/decryption utilities
  - Token expiration handling
  - Activity logging for all authentication actions
- **Type Safety**
  - Complete TypeScript interfaces for all auth operations
  - Request/response type definitions
  - Token payload interfaces
  - Email template data types
- **OpenAPI Documentation** properly organized
  - Separated schemas into `src/config/schemas/auth.schema.ts`
  - Separated endpoint paths into `src/utils/docs/auth.docs.ts`
  - Complete API documentation for all 11 auth endpoints
  - Request/response examples and error responses

### Changed
- **Simplified JWT utilities** for better maintainability
  - Reduced from 286 lines to 40 lines of code
  - Removed complex error handling wrappers
  - Simplified to three core functions: `encrypt()`, `decrypt()`, `extractTokenFromHeader()`
  - More straightforward and easier to understand
- **Removed tsc-alias dependency** from build process
  - Build script simplified from `tsc && tsc-alias` to just `tsc`
  - Faster build times and more reliable compilation
  - All imports use relative paths (no path aliases needed)
- **Updated activity logger** for compatibility
  - Support for both `id` and `userId` formats in request user object
  - More flexible type handling
- **Updated .gitignore**
  - Added patterns for better development workflow
  - Excluded unnecessary build artifacts

### Fixed
- JWT import issues with namespace imports
- Zod v4 compatibility (changed `required_error` to `message` parameter)
- Activity logger type conflicts between different user interfaces
- Unused function parameters in email templates
- TypeScript compilation errors across authentication modules
- Build script reliability without tsc-alias

### Security
- Implemented secure token generation using Node.js crypto module
- Password hashing with bcrypt (10 rounds)
- JWT token encryption for access and refresh tokens
- 4-digit verification codes with 15-minute expiration
- Protection against email enumeration in forgot password flow
- Account deactivation checks during authentication
- Activity logging for security audit trail

## [0.3.0] - 2025-10-23

### Added
- Core server infrastructure with Express.js and TypeScript
- Authentication utilities (JWT, bcrypt password hashing)
- Email service integration with Nodemailer
- Middleware system:
  - Activity logger for tracking user actions
  - Rate limiter for API protection
  - Global error handler with detailed error responses
- Utility functions for async error handling and custom errors
- OpenAPI documentation configuration with Scalar UI
- Prisma database migrations and client setup
- Development environment configuration (tsconfig.json, .vscode settings)

### Changed
- Updated .gitignore to exclude build artifacts and logs

### Fixed
- JWT token type safety issues with expiresIn parameter
- JWT import statement to use proper namespace import

## [0.2.0] - 2025-01-23

### Added
- Complete Prisma database schema with 19 models and 11 enums
- Comprehensive notification system with user preferences
  - In-app notifications with multiple event types
  - Email notification preferences
  - Notification grouping and expiration support
- ERD diagram in DBML format for dbdiagram.io visualization
- Database models:
  - Authentication: Account, VerificationToken, User
  - Notifications: NotificationPreference, Notification
  - Content: Category, Tag, Post, PostTag
  - Comments: Comment, CommentReaction, CommentMetadata, CommentMention, CommentLink
  - Series: PostSeries, PostSeriesItem
  - Media: Media, PostView
  - System: Redirect, ActivityLog
- Prisma client dependency (@prisma/client v6.18.0)

### Changed
- Moved Prisma configuration to src/config/prisma.config.ts for better organization
- Updated User model: renamed fullName to name for simplicity
- Added AMAZING reaction type to ReactionType enum
- Enhanced .gitignore to protect sensitive files (.env, node_modules)

### Features
- OAuth authentication support with Account model
- Advanced comment system with threading, moderation, and guest support
- Notification system with 9 event types
- SEO optimization fields across content models
- Soft delete support for posts and comments
- Comprehensive audit logging with ActivityLog
- Full-text search support on comment content
- Hierarchical category structure
- Post series for multi-part content

## [0.1.0] - 2025-01-23

### Added
- Initial project setup with comprehensive documentation
- Professional README.md with project overview and features
- Detailed CONTRIBUTING.md with commit conventions and deployment checklist
- CODE_OF_CONDUCT.md following Contributor Covenant v2.1
- Complete package.json with metadata and scripts structure
- MIT LICENSE file
- Database schema design with Prisma for blog platform
- Comprehensive features planning:
  - Multi-role user management (Admin, Author, User)
  - Advanced content management with rich text support
  - Hierarchical category and flexible tag system
  - Interactive comment system with nested threads
  - Media management capabilities
  - SEO optimization features
  - Analytics and tracking system
  - URL redirect management
  - Post series organization

### Documentation
- Project overview and tech stack documentation
- Installation and setup instructions
- Database schema documentation
- Development workflow guidelines
- Commit convention following Conventional Commits
- Semantic versioning guidelines
- Pre-deployment checklist
- Contributing guidelines for open source collaboration

[0.1.0]: https://github.com/liu-purnomo/server.liupurnomo.com/releases/tag/v0.1.0