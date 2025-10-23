# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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