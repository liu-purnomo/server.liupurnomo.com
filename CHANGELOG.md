# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.23.2] - 2025-11-16

### Changed
- **Rate Limiter Configuration**
  - Increased API rate limit from 100 to 1000 requests per 15 minutes (10x improvement)
  - Increased authentication rate limit from 5 to 50 attempts per 15 minutes
  - Increased registration rate limit from 3 to 30 accounts per hour
  - Increased password reset rate limit from 3 to 30 requests per hour
  - Increased email verification rate limit from 5 to 50 emails per hour
  - Increased file upload rate limit from 10 to 100 uploads per 15 minutes
  - Increased comment rate limit from 20 to 200 comments per 15 minutes
  - Increased search rate limit from 30 to 300 searches per minute
  - Increased strict rate limit from 10 to 100 requests per minute

### Security
- **CORS Policy Enhancement**
  - Implemented strict CORS policy to only allow requests from liupurnomo.com domain
  - Added support for both www and non-www variants
  - Configured credentials support for secure cookie and authentication handling
  - Defined explicit allowed methods and headers for better security control

## [0.23.1] - 2025-11-16

### Added
- **Cache Management System**
  - Added cache statistics endpoint GET `/api/cache/stats` for monitoring cache usage
  - Cache stats include Redis connection status, memory usage, total keys, and keys by prefix
  - Added cache clear endpoint DELETE `/api/cache/clear` for manual cache invalidation
  - Support for clearing all cache or specific prefix-based cache groups
  - Admin-only access for cache management endpoints
  - OpenAPI documentation for cache management endpoints

### Changed
- **Cache Invalidation Strategy**
  - Implemented automatic cache invalidation on bookmark create/delete operations
  - Added cache invalidation on comment create/update/moderate/delete operations
  - Added cache invalidation on post reaction add/remove operations
  - Ensures post detail and post list caches stay synchronized with user interactions
  - Enhanced cache service with `getStats()` method for monitoring

### Fixed
- **Cache Consistency**
  - Fixed stale cache issue where bookmark status wasn't reflected in post responses
  - Fixed comment count discrepancy in cached post data
  - Fixed reaction count mismatch between cache and database
  - Ensured cache invalidation happens before response is sent to user

## [0.23.0] - 2025-11-16

### Added
- **Redis Caching System**
  - Integrated Redis (ioredis v5.8.2) for high-performance caching
  - Created Redis client singleton with automatic reconnection
  - Implemented comprehensive cache service layer with TTL support
  - Added cache for GET `/api/sitemap` (1 hour TTL)
  - Added cache for GET `/api/posts/slug/:slug` (15 minutes TTL)
  - Added cache for GET `/api/posts` with pagination (5 minutes TTL)
  - Added cache for GET `/api/categories` (1 hour TTL)
  - Added cache for GET `/api/categories/tree` (1 hour TTL)
  - Added cache for GET `/api/tags` (1 hour TTL)
  - Added cache for GET `/api/users/@:username/statistics` (30 minutes TTL)
  - Automatic cache invalidation on post create/update/delete operations
  - Health check endpoint now includes Redis connection status
  - Development-only debug logs for cache operations
  - Expected performance improvement: 20-500x faster for cached endpoints

### Infrastructure
- Added Redis environment variables to .env.example
- Redis configuration: host, port, password, database selection
- Graceful fallback when Redis is unavailable (server continues without cache)

## [0.22.2] - 2025-11-16

### Fixed
- **Sitemap API Response Enhancement**
  - Added `title` field to sitemap posts for better SEO context
  - Added `featuredImageUrl` and `excerpt` fields to sitemap posts
  - Added `name` and `description` fields to sitemap categories for display purposes
  - Added `name` and `description` fields to sitemap tags for better identification
  - Added `fileName` and `caption` fields to sitemap media for file tracking
  - Added `title`, `featuredImageUrl`, and `description` fields to sitemap events
  - Updated TypeScript interfaces to match actual service queries
  - Updated OpenAPI schemas to reflect complete sitemap data structure

## [0.22.1] - 2025-11-15

### Fixed
- **Post API Response Consistency**
  - Fixed getPostById to include author bio and location (consistent with getPostBySlug)
  - Fixed getPostById to include category description and iconUrl
  - Fixed all post endpoints to include tag description
  - Updated PostAuthor schema to include bio and location fields
  - Updated PostCategory schema to include description and iconUrl fields
  - Updated PostTag schema to include description field
  - Ensures consistent data structure across all post detail endpoints

## [0.22.0] - 2025-11-15

### Added
- **Sitemap Data Endpoint**
  - Added GET `/api/sitemap` public endpoint for sitemap.xml generation
  - Returns all published content: posts, categories, tags, media, and events
  - Posts include slug, updatedAt, and publishedAt fields
  - Events filtered by status (UPCOMING, ONGOING, COMPLETED only)
  - Media files include fileUrl and updatedAt
  - Categories and tags include slug and updatedAt
  - Optimized with parallel queries using Promise.all
  - No authentication required (public access)

- **Public User Statistics Endpoint**
  - Added GET `/api/users/@:username/statistics` public endpoint
  - Returns comprehensive user profile statistics without authentication
  - User profile data: id, username, name, avatarUrl, bio, location, createdAt
  - Statistics metrics: totalPosts, totalPublishedPosts, totalViews, totalComments, totalReactions, joinedDaysAgo
  - Top 5 posts by view count with title, slug, viewCount, publishedAt
  - 5 most recent published posts with excerpt and featuredImageUrl
  - Aggregates data from posts, comments, and reactions tables
  - Efficient parallel queries for optimal performance

### Security
- **Privacy Enhancement: Role Field Removal**
  - Removed `role` field from all public user endpoints for privacy protection
  - Affects GET `/api/users/public/@:username` endpoint
  - Affects GET `/api/users/public/:id` endpoint
  - Affects GET `/api/users/@:username/statistics` endpoint
  - Role information now only visible to authenticated users viewing their own profile
  - Role information accessible to admins via admin-only endpoints

### Changed
- **API Documentation Schemas**
  - Fixed Pagination schema field names to match actual API responses
  - Changed `PaginationMeta` to `Pagination` across all documentation
  - Updated field names: `itemsPerPage` → `perPage`, `page` → `currentPage`
  - Added `PaginatedSuccessResponse` schema for consistent paginated responses
  - Fixed PostAuthor schema: removed bio and location fields
  - Fixed PostCategory schema: removed description and iconUrl fields
  - Fixed PostTag schema: removed description field
  - Replaced all hardcoded pagination objects with schema references
  - Updated pagination references in 7 documentation files (activity-log, bookmark, category, event, media, tag, user)

### Documentation
- **Sitemap API Documentation**
  - Created comprehensive OpenAPI schemas for sitemap data structures
  - Added endpoint documentation with detailed response examples
  - Documented all content types: posts, categories, tags, media, events
  - Registered sitemap schemas and paths in OpenAPI configuration

- **User Statistics API Documentation**
  - Created detailed OpenAPI schemas for user statistics responses
  - Documented user profile, metrics, top posts, and recent posts structures
  - Added privacy notes indicating role field exclusion
  - Registered user statistics schemas and paths in OpenAPI configuration

## [0.21.0] - 2025-11-15

### Added
- **Notification Management Endpoints**
  - Added GET `/api/notifications` endpoint to retrieve user's notifications with pagination
  - Support filtering by read/unread status and notification type
  - Sort by createdAt or updatedAt with ascending or descending order
  - Added GET `/api/notifications/unread-count` endpoint for notification badges
  - Added GET `/api/notifications/:id` endpoint to retrieve single notification
  - Added PATCH `/api/notifications/:id/read` to mark single notification as read
  - Added PATCH `/api/notifications/read-all` to mark all notifications as read (bulk operation)
  - Added DELETE `/api/notifications/:id` to delete single notification
  - Added DELETE `/api/notifications/read` to delete all read notifications (bulk operation)
  - All endpoints require authentication with user ownership validation
  - Defensive pagination with type coercion for robust query handling

### Documentation
- **Notification API Documentation**
  - Created comprehensive OpenAPI schemas for all notification responses
  - Documented all notification types with enum values
  - Added detailed endpoint documentation for all 7 notification endpoints
  - Includes request parameters, response schemas, and error handling
  - Registered notification schemas and paths in OpenAPI configuration

## [0.20.0] - 2025-11-15

### Added
- **Blog Statistics Endpoint**
  - Added GET `/api/statistics` endpoint for comprehensive blog analytics (Admin only)
  - Overview metrics: total posts, views, comments, reactions, bookmarks, users, categories, tags
  - Top posts by views (top 5) and interactions (top 5) with detailed metrics
  - Recent posts list (most recent 5 published posts)
  - Recent activity tracking (last 7 days): comments, reactions, bookmarks, views
  - Reaction breakdown by type for both posts and comments
  - Includes engagement metrics: interaction count, comment count, reaction count per post
  - Authentication required with ADMIN role for access

- **Reserved Slugs Validation**
  - Added validation to prevent BLOG type posts from using reserved slugs
  - Reserved slugs: `about`, `contact`, `privacy`, `privacy-policy`, `blog`, `tutorial`, `terms`, `new-post`, `dashboard`, `profile`
  - Prevents route conflicts with static frontend pages
  - Exact match validation (e.g., `about-my-dream` is allowed, but `about` is not)
  - TUTORIAL type posts are not affected by this restriction
  - Clear error messages showing list of reserved slugs when validation fails

### Documentation
- **Statistics API Documentation**
  - Created comprehensive OpenAPI schemas for statistics response
  - Documented TopPost, StatisticsOverview, TopPosts, RecentActivity, ReactionBreakdown schemas
  - Added detailed endpoint documentation with descriptions and examples
  - Registered statistics schemas and paths in OpenAPI configuration

## [0.19.0] - 2025-11-15

### Added
- **User Reactions Profile Endpoint**
  - Added GET `/api/post-reactions` endpoint to retrieve authenticated user's reactions across all posts
  - Support pagination with configurable page and limit parameters (max 100 items per page)
  - Filter reactions by specific reaction type (LIKE, HELPFUL, LOVE, INSIGHTFUL, AMAZING)
  - Sort by creation date with ascending or descending order
  - Includes post details (id, title, slug, excerpt, featuredImageUrl, status, deletedAt) in response
  - Returns paginated result with user and post information for profile page context
  - Authentication required via Bearer token

- **Post Details in Comments List**
  - Enhanced GET `/api/comments` endpoint to include post information in response
  - Added post field with id, title, and slug to CommentListItem type
  - Enables profile page to display post context for each comment
  - Useful for showing which post a comment belongs to without additional API calls

### Changed
- **Comment Service Enhancement**
  - Updated `getComments()` service function to include post relation in Prisma query
  - Modified CommentListItem interface to support optional post field
  - Improved response structure for better frontend integration

### Documentation
- **API Schema Updates**
  - Updated Comment schema in OpenAPI documentation to include post field
  - Added post-reaction validator with comprehensive query parameter validation
  - Created dedicated route documentation for user reactions endpoint
  - Enhanced type definitions for comment responses with post details

## [0.18.0] - 2025-11-15

### Added
- **Bookmark Integration with Posts**
  - Added GET `/api/bookmarks/post/:postId` endpoint to check if user has bookmarked a specific post
  - Added `userBookmark` field in post detail response (GET `/api/posts/slug/:slug`) for authenticated users
  - Returns bookmark status (id, isFavorite, isRead, note, tags, createdAt) when user is logged in
  - Returns null when user is not authenticated or has not bookmarked the post
  - Optional authentication support for post detail endpoint using `optionalAuth` middleware
  - Enhanced user experience by providing immediate bookmark status without additional API calls

### Changed
- **Post Detail Endpoint Enhancement**
  - Updated GET `/api/posts/slug/:slug` to support optional authentication
  - Post detail now includes `userBookmark` field conditionally based on authentication
  - Improved API documentation to reflect optional authentication behavior
  - Added detailed OpenAPI schema for `userBookmark` with oneOf (object or null) pattern

### Fixed
- **Zod Validator TypeScript Compatibility**
  - Fixed TypeScript compilation errors in query validators (bookmark, comment, event)
  - Removed problematic `.default({})` pattern that conflicted with Zod v4 type inference
  - Resolved "Type '{}' is missing properties" errors in bookmark, comment, and event validators
  - Maintained individual field defaults while fixing object-level type issues
  - Build now compiles successfully without TypeScript errors

### Documentation
- **API Documentation Updates**
  - Added OpenAPI documentation for GET `/api/bookmarks/post/:postId` endpoint
  - Updated POST detail documentation with optional authentication details
  - Added comprehensive schema definition for `userBookmark` response field
  - Enhanced error handling documentation with field-level validation error details

## [0.17.0] - 2025-11-14

### Added
- **Event Portfolio System**
  - Complete CRUD operations for event portfolio management
  - Create event: POST `/api/events` for adding workshops, trainings, seminars, and speaking engagements
  - Get all events: GET `/api/events` with filtering by type, location, status, and date range
  - Get single event: GET `/api/events/:id` or `/api/events/slug/:slug` with full details
  - Update event: PATCH `/api/events/:id` for editing event information
  - Delete event: DELETE `/api/events/:id` with soft delete support
  - Event types: WORKSHOP, TRAINING, SEMINAR, CONFERENCE, MEETUP, WEBINAR, HACKATHON, TALK, OTHER
  - Location types: ONLINE, OFFLINE, HYBRID with full address and map URL support
  - Gallery images support for event photos and documentation
  - Role and topics tracking for speaker engagements
  - Participant count tracking for event metrics
  - SEO optimization with meta tags, Open Graph, and Twitter Card support
  - Public access for published events, admin/author access for management

- **Bookmark System**
  - Complete CRUD operations for user bookmarks
  - Create bookmark: POST `/api/bookmarks` to save posts for later reading
  - Get all bookmarks: GET `/api/bookmarks` with filtering by favorite, read status, and tags
  - Get single bookmark: GET `/api/bookmarks/:id` with post details
  - Update bookmark: PATCH `/api/bookmarks/:id` to edit notes, tags, and status
  - Delete bookmark: DELETE `/api/bookmarks/:id` to remove saved posts
  - Toggle read status: POST `/api/bookmarks/:id/toggle-read` to mark as read/unread
  - Toggle favorite: POST `/api/bookmarks/:id/toggle-favorite` to add/remove from favorites
  - Personal notes support up to 5000 characters
  - Tag system with up to 20 tags per bookmark
  - Read tracking with timestamp
  - Favorite bookmarks for quick access
  - Advanced filtering: search in titles and notes, sort by multiple fields
  - User ownership validation for security
  - Unique constraint prevents duplicate bookmarks

### Changed
- **Database Schema Updates**
  - Added Event model with enums for EventType, EventStatus, and EventLocationType
  - Added Bookmark model with unique constraint on [userId, postId]
  - Added migration: `20251114160425_add_event_portfolio_system`

- **API Documentation**
  - Added comprehensive OpenAPI documentation for Event endpoints
  - Added comprehensive OpenAPI documentation for Bookmark endpoints
  - Updated API tags: Added "Events" and "Bookmarks" categories
  - Enhanced schema definitions with detailed examples

- **Routes Configuration**
  - Added `/api/events` route with full CRUD operations
  - Added `/api/bookmarks` route with full CRUD operations
  - Integrated new routes into main router

## [0.16.1] - 2025-11-14

### Changed
- **Email Template Redesign**
  - Complete redesign of all email templates with modern, clean aesthetics
  - Replaced gradient backgrounds with solid colors for better email client compatibility
  - Updated font stack to use Inter with system font fallbacks
  - Improved color scheme with modern indigo (#4f46e5) as primary color
  - Enhanced spacing, padding, and border-radius for better visual hierarchy
  - Better mobile responsiveness with optimized breakpoints
  - Improved accessibility with better contrast ratios

- **OAuth Email Templates Enhancement**
  - Updated Google OAuth welcome email template to remove temporary password display
  - Updated GitHub OAuth welcome email template to remove temporary password display
  - Added clearer instructions for setting up password through "Forgot Password" feature
  - Improved security notices and user guidance in OAuth emails
  - Enhanced info boxes with better visual structure

- **Code Quality Improvements**
  - Fixed formatting in `post.service.ts` with better code organization
  - Removed unnecessary `tempPassword` parameter from OAuth email template calls
  - Improved code readability with consistent formatting

### Fixed
- **OAuth Service**
  - Fixed trailing comma formatting in `githubAuth.service.ts`
  - Fixed line breaks and formatting in `googleAuth.service.ts`
  - Removed obsolete temporary password parameter from email template functions

## [0.16.0] - 2025-11-06

### Added
- **Comment System with Nested Replies**
  - Complete CRUD operations for comments and replies
  - Create comment endpoint: POST `/api/comments` with post association
  - Create reply endpoint: POST `/api/comments/:commentId/replies` for nested discussions
  - Get comments by post: GET `/api/posts/:postId/comments` with pagination and sorting
  - Get single comment with replies: GET `/api/comments/:commentId` with nested reply tree
  - Update comment: PATCH `/api/comments/:commentId` for editing
  - Delete comment: DELETE `/api/comments/:commentId` with soft delete support
  - Nested comment structure with unlimited depth support
  - Author information included in comment responses
  - Reply count tracking per comment
  - Soft delete cascade for comments and replies
  - OpenAPI documentation for all comment endpoints

- **Comment Validation**
  - Comprehensive validation schema for comment creation and updates
  - Content validation (min 1, max 5000 characters)
  - Sanitization for security
  - Parent comment validation for replies

- **Comment Documentation**
  - Complete OpenAPI schema for Comment and CommentReply types
  - Request/response examples with nested structures
  - Error response documentation
  - Authentication requirements

### Changed
- **Post Reaction Service**
  - Refactored reaction toggle logic for better code organization
  - Improved error handling with detailed error messages
  - Enhanced validation for reaction types
  - Better type safety with PostReactionType enum usage

- **Post Validator**
  - Improved validation schemas formatting
  - Better error messages for validation failures
  - Enhanced type inference

- **Database Schema**
  - Updated Comment model relations for better query performance
  - Added composite unique constraint removal migration for PostReaction
  - Improved indexing for comment queries

### Fixed
- **Post Reaction Constraints**
  - Removed duplicate unique constraints on PostReaction model
  - Fixed userId and postId relation constraints
  - Migration: `20251105201341_remove_post_reaction_unique_constraints`

### Security
- **Comment System**
  - User authentication required for comment operations
  - Comment ownership validation for updates and deletes
  - Content sanitization to prevent XSS attacks
  - Rate limiting ready for comment spam prevention

## [0.15.0] - 2025-11-05

### Added
- **Post Reactions Feature**
  - Complete post reaction system with 5 reaction types: LIKE, HELPFUL, LOVE, INSIGHTFUL, AMAZING
  - Toggle reaction endpoint: POST `/api/posts/:postId/reactions` to add or remove reactions
  - Get reactions by type endpoint: GET `/api/posts/:postId/reactions/:reactionType`
  - List all reactions endpoint: GET `/api/posts/:postId/reactions` with pagination
  - User-based reaction tracking and filtering
  - IP address and user agent tracking for analytics
  - Reaction counts aggregation on post model (likeCount, helpfulCount, loveCount, insightfulCount, amazingCount)
  - Database triggers to maintain accurate reaction counts
  - Soft delete support for reactions
  - OpenAPI documentation for all reaction endpoints

### Changed
- **Post Service**
  - Updated `getPostBySlug` to include `postReactions` with user details
  - Updated `getPostById` to include `postReactions` with user details
  - Added `_count.postReactions` to post response for total reaction count
  - Modified `toPostResponse` helper to map and return postReactions array

- **Post Schema**
  - Added `postReactions` field to PostResponse schema in OpenAPI
  - Added reaction count fields to Post model schema
  - Updated post response examples to include reaction data

- **Database Schema**
  - Added `PostReaction` model with relations to Post and User
  - Added reaction count fields to Post model (likeCount, helpfulCount, loveCount, insightfulCount, amazingCount)
  - Created database migration for post reaction feature
  - Added indexes for performance optimization on reaction queries

### Security
- **Post Reactions**
  - Optional authentication for reaction endpoints (works for both authenticated and anonymous users)
  - User-based reaction ownership validation
  - IP-based rate limiting ready for anonymous reactions

## [0.14.1] - 2025-11-04

### Fixed
- **Media Service**
  - Fixed thumbnail URL generation to handle all image size variants (-original, -large, -medium, -small)
  - Improved regex pattern for extracting base filename from image URLs

### Added
- **Post OpenAPI Documentation**
  - Complete OpenAPI schema for post endpoints
  - Added post schemas to OpenAPI documentation
  - Integrated post API paths into Scalar API reference

## [0.14.0] - 2025-11-04

### Added
- **Media Library System**
  - WordPress-like media management with full CRUD operations
  - Image upload with automatic processing (5 sizes: thumbnail, small, medium, large, original)
  - Support for images (20MB max), videos (100MB max), and documents
  - Image processing with Sharp library for optimization
  - Media metadata: altText, caption, width, height, mimeType, fileSize
  - User-based media ownership and access control
  - OpenAPI documentation for all media endpoints
  - 5 endpoints: Upload, Get All (paginated), Get by ID, Update, Delete

- **Post Management CRUD**
  - Complete post CRUD with role-based access control (AUTHOR and ADMIN only)
  - Public endpoints for published posts (by ID, slug, paginated list)
  - Admin/Author endpoints with draft access and ownership validation
  - JSON-based post creation with URL references to media library
  - Featured image and OG image support via URL strings
  - Post types: BLOG, TUTORIAL with difficulty levels
  - Post status: DRAFT, PUBLISHED, SCHEDULED, ARCHIVED
  - Post scheduling with publishedAt and scheduledAt fields
  - Soft delete and permanent delete operations
  - View count tracking with async increment
  - Reading time calculation support
  - Rich content support with JSON content blocks
  - Category and tag associations
  - SEO metadata: metaTitle, metaDescription, metaKeywords, ogImageUrl, canonicalUrl
  - Activity logging for all post operations

### Changed
- **Upload Middleware Enhancement**
  - Increased image size limit from 5MB to 20MB
  - Increased video size limit from 50MB to 100MB
  - Added support for multiple file types in media uploads

### Technical
- Post images now reference media library URLs instead of direct file uploads
- Image processing logic moved from post service to media service
- Consistent use of `avatarUrl` field for user profile pictures across all modules
- Improved TypeScript type safety with non-null assertions where guaranteed

## [0.13.1] - 2025-11-03

### Added
- **Category SEO Enhancement**
  - Added `metaTitle` field to category schema for custom SEO titles
  - Added `metaDescription` field to category schema for SEO descriptions
  - Updated category list response to include SEO metadata fields
  - Enhanced OpenAPI documentation for category endpoints

## [0.13.0] - 2025-11-03

### Added
- **Medium-Style Inline Interaction System**
  - Complete inline comment system with text selection tracking (startOffset, endOffset, selectedText, blockId, paragraphId)
  - Inline comment threading with nested replies support
  - Inline comment reactions (like, helpful, love, insightful, amazing)
  - Inline comment mentions with notification tracking
  - Guest user support for inline comments with IP tracking and spam prevention
  - Moderation system for inline comments (approval, hiding, spam score, report count)
  - Soft delete support with deletedAt timestamp
  - 6 new tables: InlineComment, InlineCommentReply, InlineCommentReaction, InlineCommentReplyReaction, InlineCommentMention, InlineCommentReplyMention

- **Paragraph Reaction System**
  - Quick reactions directly on paragraphs without comments (Medium-style clap)
  - Support for blockId and paragraphId identification
  - Guest reaction support with IP-based uniqueness constraints
  - 1 new table: ParagraphReaction

- **Highlight System with Notes and Collections**
  - Text highlighting with customizable colors and privacy controls
  - Highlight notes with threaded discussion support
  - Public/private highlight visibility
  - Social media sharing tracking (Twitter, Facebook, LinkedIn, etc.)
  - Highlight collections for organizing saved highlights (like folders or reading lists)
  - Mention support in highlights and notes
  - Reactions on highlights and notes
  - Analytics tracking (click count, share count, view count)
  - 11 new tables: Highlight, HighlightNote, HighlightReaction, HighlightNoteReaction, HighlightShare, HighlightMention, HighlightNoteMention, HighlightCollection, HighlightCollectionItem

- **Notification System Enhancement**
  - 10 new notification types for inline interactions:
    - INLINE_COMMENT_ON_POST
    - REPLY_TO_INLINE_COMMENT
    - MENTION_IN_INLINE_COMMENT
    - REACTION_ON_INLINE_COMMENT
    - HIGHLIGHT_ON_POST
    - NOTE_ON_HIGHLIGHT
    - REPLY_TO_HIGHLIGHT_NOTE
    - MENTION_IN_HIGHLIGHT
    - REACTION_ON_HIGHLIGHT
    - SHARE_HIGHLIGHT

- **Notification Preference Enhancement**
  - 16 new notification preference fields organized by category:
    - Inline Comments: inlineCommentOnPost, replyToInlineComment, mentionInInlineComment, reactionOnInlineComment
    - Highlights: highlightOnPost, noteOnHighlight, replyToHighlightNote, mentionInHighlight, reactionOnHighlight, shareHighlight
    - Email notifications: emailInlineCommentOnPost, emailHighlightOnPost, emailNoteOnHighlight
  - Reorganized notification preferences into logical sections (Comments, Inline Comments, Highlights, General)
  - Updated API validators and OpenAPI schemas for new preferences

### Changed
- **Database Schema**
  - Updated NotificationType enum with 10 new values for inline interactions
  - Updated NotificationPreference model with 16 new boolean fields
  - Updated Post model with 3 new relations (inlineComments, paragraphReactions, highlights)
  - Updated User model with 24 new relations for inline interaction features
  - Enhanced ERD documentation with complete inline interaction system models (18 new tables)

- **API Documentation**
  - Updated OpenAPI schemas for notification preferences with new fields
  - Enhanced request/response examples for inline interaction features
  - Improved documentation organization with categorized notification types

### Database Migrations
- **Migration: add_medium_style_inline_interactions**
  - Created 18 new tables for inline interaction system
  - Added 89 composite indexes for optimized query performance
  - Added 24 foreign key constraints with proper cascade rules
  - Guest user support with nullable userId fields

- **Migration: add_notification_prefs_for_inline_interactions**
  - Added 16 new notification preference columns to NotificationPreference table
  - Set appropriate default values for all new preferences

### Technical Details
- All inline interactions support guest users (nullable userId with IP tracking)
- Text selection tracking works with any editor (EditorJS, Lexical, etc.)
- No HTML storage or fixed positioning for mobile-friendly design
- Complete anti-spam system (reportCount, spamScore, isHidden, moderation tracking)
- Denormalized metrics for performance (likeCount, replyCount, noteCount, etc.)
- Soft delete pattern for recoverability
- Composite indexes for common query patterns

## [0.12.0] - 2025-10-29

### Added
- **Activity Log Management System (Admin Only)**
  - Complete RUD (Read, Update, Delete) operations for activity logs
  - GET `/api/activity-logs` - Retrieve paginated activity logs with advanced filtering
  - GET `/api/activity-logs/:id` - Get detailed activity log by ID
  - GET `/api/activity-logs/stats` - Get statistical data about activity logs
  - PATCH `/api/activity-logs/:id` - Update activity log metadata (severity, description, error message)
  - DELETE `/api/activity-logs/:id` - Delete single activity log
  - POST `/api/activity-logs/bulk-delete` - Bulk delete logs based on filters for cleanup operations
  - Advanced filtering: userId, action, entity, entityId, success status, severity, HTTP method, date range, search
  - Sort options: createdAt, action, entity, severity, duration, userId
  - Statistics grouping: by action, severity, entity with average duration calculation
  - Comprehensive OpenAPI documentation with detailed request/response schemas
  - All endpoints protected with admin-only role middleware

### Security
- **Role-Based Access Control Enhancement**
  - Activity log endpoints restricted to ADMIN role only
  - Enhanced authorization checks for sensitive log operations
  - Activity logging for all administrative actions (update, delete operations)

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

## [0.2.0] - 2025-11-23

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

## [0.1.0] - 2025-11-23

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