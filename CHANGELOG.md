# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.11.0] - 2025-10-29

### Added
- **Notification Preference Management**
  - Complete CRUD operations for user notification preferences
  - GET `/api/users/me/notification-preferences` - Retrieve user notification preferences with auto-create on first access
  - PATCH `/api/users/me/notification-preferences` - Update specific notification preferences
  - POST `/api/users/me/notification-preferences/reset` - Reset preferences to default values
  - 17 configurable notification types across in-app, email, and system categories
  - Email digest frequency options (daily/weekly)
  - Comprehensive OpenAPI documentation with request/response schemas
  - Automatic preference creation with sensible defaults for new users

### Changed
- **API Documentation Improvements**
  - Enhanced tag API documentation with detailed descriptions
  - Improved category API documentation with comprehensive examples
  - Updated common schema definitions for better clarity
  - Added structured examples for pagination responses
  - Standardized error response formats across all endpoints

## [0.10.0] - 2025-10-29

### Added
- **Password Update Feature**
  - Added password change functionality for authenticated users
  - Password strength validation with uppercase, lowercase, and number requirements
  - Verification of current password before allowing changes
  - Prevention of reusing the same password
  - Proper error handling for OAuth-only accounts
- **Shared Password Generator Utility** (`src/lib/passwordGenerator.ts`)
  - Centralized password generation function with configurable length
  - Ensures generated passwords meet security requirements
  - Eliminates duplicate password generation code across OAuth services

### Changed
- **Backend Refactoring - Validator Schemas**
  - Removed unnecessary wrapper objects from 15 validator schemas
  - Fixed auth validators: checkEmail, register, login, forgotPassword, resetPassword, verifyEmail, resendVerification, refreshToken, changePassword
  - Fixed tag validators: createTag, updateTag, deleteTag, getTags
  - Fixed category validators: createCategory, updateCategory, getCategories
  - Direct schema inference for cleaner type exports
- **Validation Middleware Enhancement** (`src/middlewares/validate.ts`)
  - Improved property replacement logic for proper type coercion
  - Better handling of query parameter string-to-number conversion
  - Ensures Prisma receives correct data types
- **Service Layer Improvements**
  - Added defensive type coercion for pagination parameters in tag and category services
  - Ensures proper number types for `skip` and `take` parameters
  - Prevents Prisma validation errors from string query parameters
- **OAuth Services Refactoring**
  - Removed duplicate password generation code from GitHub Auth service
  - Removed duplicate password generation code from Google Auth service
  - Both services now use shared `generateRandomPassword()` utility

### Fixed
- **Prisma Validation Errors**
  - Resolved "Expected Int, provided String" errors for pagination parameters
  - Fixed query parameter type coercion across all list endpoints
  - Proper handling of `take` and `skip` parameters in database queries
- **Type Safety**
  - Fixed type exports to match direct schema inference
  - Removed incorrect bracket notation from type definitions
  - Improved TypeScript type checking across validators

### Documentation
- **Enhanced Development Guidelines** (`helpers/DEVELOPMENT-INSTRUCTION.md`)
  - Added prominent Prisma schema checking section with visual alerts
  - Emphasized mandatory schema verification before coding
  - Added comprehensive OpenAPI documentation workflow
  - Included standardized response types requirement (ApiResponse)
  - Enhanced common mistakes table with real-world examples
  - Added detailed validator pattern rules and best practices
  - Updated core principles to prioritize schema-first development
  - Added defensive programming patterns for pagination

## [0.9.0] - 2025-10-28

### Added
- **Category CRUD Feature**
  - Complete Category management with hierarchical structure support
  - Category icon upload functionality with automatic file handling and validation
  - Parent-child relationship support for nested category organization
  - Custom ordering with `orderPosition` field for manual sorting
  - SEO-optimized with meta title and description fields
  - Slug-based category identification for clean URLs
  - OpenAPI documentation for all Category endpoints
  - RBAC enforcement: ADMIN and AUTHOR can Create, Update, Delete; all users can Read
- **Category API Endpoints** (`src/routes/category.routes.ts`)
  - `GET /api/categories` - Get paginated list of categories
  - `GET /api/categories/tree` - Get hierarchical category tree structure
  - `GET /api/categories/:id` - Get category by ID
  - `GET /api/categories/slug/:slug` - Get category by slug
  - `POST /api/categories` - Create new category (ADMIN/AUTHOR only)
  - `PATCH /api/categories/:id` - Update category (ADMIN/AUTHOR only)
  - `DELETE /api/categories/:id` - Delete category (ADMIN/AUTHOR only)
  - `DELETE /api/categories/:id/icon` - Delete category icon (ADMIN/AUTHOR only)
- **Category Service** (`src/services/category.service.ts`)
  - `getAllCategories()` - Paginated category list with search and filtering
  - `getCategoryTree()` - Build and return hierarchical category structure
  - `getCategoryById()` - Get single category with post count
  - `getCategoryBySlug()` - Get category by slug identifier
  - `createCategory()` - Create category with validation and icon upload
  - `updateCategory()` - Update category with icon replacement support
  - `deleteCategory()` - Delete category with cascade handling
  - `deleteCategoryIcon()` - Remove category icon file
- **Category Validators** (`src/validators/category.validator.ts`)
  - Zod schemas for all category operations
  - Name validation: 1-100 characters
  - Slug validation: lowercase, alphanumeric with hyphens
  - Description validation: up to 500 characters
  - Order position validation: positive integers
  - Meta fields validation for SEO optimization
- **Category File Upload** (`src/middlewares/upload.ts`)
  - Multer configuration for category icon uploads
  - File type validation: PNG, JPG, JPEG, WebP, SVG, GIF
  - File size limit: 2MB maximum
  - Automatic storage in `uploads/categories/` directory
  - Proper error handling with custom error messages
- **Tag CRUD Feature**
  - Complete Tag management system for content organization
  - Simpler structure compared to Category (no icon, no parent, no ordering)
  - SEO-optimized with meta title and description fields
  - Slug-based tag identification for clean URLs
  - OpenAPI documentation for all Tag endpoints
  - RBAC enforcement: ADMIN and AUTHOR can Create, Update, Delete; all users can Read
- **Tag API Endpoints** (`src/routes/tag.routes.ts`)
  - `GET /api/tags` - Get paginated list of tags
  - `GET /api/tags/:id` - Get tag by ID
  - `GET /api/tags/slug/:slug` - Get tag by slug
  - `POST /api/tags` - Create new tag (ADMIN/AUTHOR only)
  - `PATCH /api/tags/:id` - Update tag (ADMIN/AUTHOR only)
  - `DELETE /api/tags/:id` - Delete tag (ADMIN/AUTHOR only)
- **Tag Service** (`src/services/tag.service.ts`)
  - `getAllTags()` - Paginated tag list with search functionality
  - `getTagById()` - Get single tag with post count
  - `getTagBySlug()` - Get tag by slug identifier
  - `createTag()` - Create tag with duplicate slug validation
  - `updateTag()` - Update tag with validation
  - `deleteTag()` - Delete tag with assigned posts validation
- **Tag Validators** (`src/validators/tag.validator.ts`)
  - Zod schemas for all tag operations
  - Name validation: 1-50 characters
  - Slug validation: lowercase, alphanumeric with hyphens
  - Description validation: up to 500 characters
  - Meta fields validation for SEO optimization

### Changed
- **Upload Middleware** (`src/middlewares/upload.ts`)
  - Added `uploadCategoryIcon` multer configuration for category icon uploads
  - Enhanced file validation for image uploads
  - Exported `handleMulterError` for consistent error handling

### Fixed
- **Category Validator Parameters**
  - Fixed params validation in `getCategoryByIdValidator` to work correctly with validate() middleware
  - Fixed params validation in `getCategoryBySlugValidator`
  - Removed redundant params wrapper that caused validation errors during delete operations

### Security
- File upload validation prevents malicious file types
- File size limits prevent DoS attacks via large uploads
- RBAC enforcement ensures only authorized users can manage categories and tags
- Proper validation prevents SQL injection and XSS attacks through slug and name fields

## [0.8.0] - 2025-10-28

### Added
- **User Profile Username Update Feature**
  - Users can now update their username through the profile update endpoint
  - Username validation with reserved words protection
  - Reserved usernames list: admin, superadmin, administrator, root, system, support, help, info, api, www, mail, ftp, localhost, moderator, mod
  - Automatic duplicate username detection with conflict error response
  - Username format validation: 3-30 characters, alphanumeric and underscores only
- **Enhanced User Validators** (`src/validators/user.validator.ts`)
  - Added `RESERVED_USERNAMES` constant for protected username list
  - Updated `usernameSchema` with Zod refinement for reserved username checking
  - Added username field to `updateProfileSchema` for user profile updates
- **Enhanced User Service** (`src/services/user.service.ts`)
  - Updated `updateCurrentUserProfile()` to handle username changes
  - Added username conflict detection before update
  - Throws `ConflictError` (409) when username is already taken
- **Updated API Documentation**
  - Updated `UpdateProfileRequest` schema with username field and description
  - Added 409 Conflict response to PATCH /api/users/me endpoint documentation
  - Documented reserved username restrictions in OpenAPI spec

### Changed
- **User Types** (`src/types/user.types.ts`)
  - Added `username?: string` field to `UpdateProfileRequest` interface
- **OpenAPI Schemas** (`src/config/schemas/user.schema.ts`)
  - Updated `UpdateProfileRequest` schema to include username field with pattern validation and description

### Security
- Protected system-critical usernames from being claimed by regular users
- Reserved username list prevents potential security issues and confusion

## [0.7.0] - 2025-10-27

### Added
- **Standardized API Response Structure** across all endpoints
  - Unified response format with `success`, `message`, `data`, `pagination`, `timestamp`, and `path` fields
  - Consistent error response format with detailed error objects
  - TypeScript types for all response structures (`ApiResponse`, `SuccessResponse`, `ErrorResponse`)
  - Pagination metadata with helper flags (`hasNextPage`, `hasPreviousPage`)
- **Response Utility Functions** (`src/utils/apiResponse.ts`)
  - `sendSuccess()` - Success response (200)
  - `sendCreated()` - Created response (201)
  - `sendPaginatedSuccess()` - Paginated list response
  - `sendError()` - Generic error response
  - `sendBadRequest()` - Bad request error (400)
  - `sendUnauthorized()` - Unauthorized error (401)
  - `sendForbidden()` - Forbidden error (403)
  - `sendNotFound()` - Not found error (404)
  - `sendConflict()` - Conflict error (409)
  - `sendValidationError()` - Validation error (422)
  - `sendInternalError()` - Internal server error (500)
  - `calculatePagination()` - Pagination metadata calculator
- **TypeScript Type Definitions** (`src/types/response.types.ts`)
  - `ApiResponse<T>` - Generic API response interface
  - `SuccessResponse<T>` - Typed success response
  - `ErrorResponse` - Error response type
  - `PaginationMeta` - Pagination metadata interface
  - `ApiError` - Error detail object
  - `PaginationOptions` - Query pagination options
  - `PaginatedResult<T>` - Paginated data result type
- **OpenAPI Schemas** (`src/config/schemas/common.schema.ts`)
  - `SuccessResponse` - Standard success response schema
  - `ErrorResponse` - Standard error response schema
  - `ApiError` - Error detail schema
  - `PaginationMeta` - Pagination metadata schema
  - `ValidationErrorResponse` - 422 validation error schema
  - `UnauthorizedResponse` - 401 unauthorized schema
  - `ForbiddenResponse` - 403 forbidden schema
  - `NotFoundResponse` - 404 not found schema
  - `InternalErrorResponse` - 500 internal error schema

### Changed
- **All Authentication Controller Endpoints** refactored to use standardized response helpers
  - `POST /api/auth/check-email` - Now returns standardized response
  - `POST /api/auth/register` - Uses `sendCreated()` for 201 response
  - `POST /api/auth/login` - Standardized success response
  - `POST /api/auth/forgot-password` - Standardized response
  - `POST /api/auth/reset-password` - Standardized response
  - `POST /api/auth/verify-email` - Standardized response
  - `POST /api/auth/resend-verification` - Standardized response
  - `POST /api/auth/change-password` - Standardized response
  - `POST /api/auth/refresh-token` - Standardized response
  - `GET /api/auth/me` - Standardized response
  - `POST /api/auth/logout` - Standardized response
- **OpenAPI Configuration** (`src/config/openapi.config.ts`)
  - Removed duplicate schema definitions (Error, SuccessResponse, PaginationMeta)
  - Now imports common schemas from `common.schema.ts`

### Documentation
- **Development Instruction** (`helpers/DEVELOPMENT-INSTRUCTION.md`)
  - Added comprehensive API Response Standard section
  - Response structure examples (success and error)
  - Complete list of response helper functions with usage examples
  - Pagination helper documentation
  - Best practices for using standardized responses

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