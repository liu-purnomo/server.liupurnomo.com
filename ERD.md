// ==================== BLOG PLATFORM ERD ====================
// Database Schema for Blog Platform with Advanced Features
// Generated from Prisma Schema
// Docs: https://dbml.dbdiagram.io/docs

// ==================== ENUMS ====================

Enum UserRole {
  ADMIN
  AUTHOR
  USER
}

Enum PostType {
  BLOG
  TUTORIAL
}

Enum PostStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
  ARCHIVED
}

Enum DifficultyLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

Enum ReactionType {
  LIKE
  HELPFUL
  LOVE
  INSIGHTFUL
  AMAZING
}

Enum SchemaType {
  COMMENT
  ANSWER
  QUESTION
}

Enum RedirectStatus {
  REDIRECT_301
  REDIRECT_302
  REDIRECT_307
}

Enum ActivityAction {
  CREATE
  READ
  UPDATE
  DELETE
  LOGIN
  LOGOUT
  REGISTER
  RESET_PASSWORD
  VERIFY_EMAIL
}

Enum HttpMethod {
  GET
  POST
  PUT
  PATCH
  DELETE
}

Enum LogSeverity {
  INFO
  WARNING
  ERROR
  CRITICAL
}

Enum NotificationType {
  COMMENT_ON_POST
  REPLY_TO_COMMENT
  MENTION_IN_COMMENT
  REACTION_ON_COMMENT
  POST_PUBLISHED
  COMMENT_APPROVED
  COMMENT_FEATURED
  SYSTEM_ANNOUNCEMENT
  MODERATION_ACTION
}

// ==================== AUTHENTICATION MODELS ====================

Table Account {
  id varchar [primary key]
  userId varchar [not null]
  type varchar [not null, note: 'OAuth provider type']
  provider varchar [not null, note: 'Provider name (google, github, etc)']
  providerAccountId varchar [not null]
  refresh_token text
  access_token text
  expires_at integer
  token_type varchar
  scope varchar
  id_token text
  session_state varchar

  indexes {
    (provider, providerAccountId) [unique]
    userId
  }
}

Table VerificationToken {
  identifier varchar [not null, note: 'Email or user ID']
  token varchar [unique, not null]
  expires timestamp [not null]

  indexes {
    (identifier, token) [unique]
    token
  }
}

// ==================== USER MANAGEMENT ====================

Table User {
  id varchar [primary key]
  username varchar [unique, not null]
  email varchar [unique, not null]
  passwordHash varchar [not null]
  name varchar
  avatarUrl varchar
  bio text
  location varchar
  role UserRole [default: 'USER']
  isActive boolean [default: true]
  emailVerifiedAt timestamp
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]

  indexes {
    email
    username
    role
  }
}

// ==================== NOTIFICATION SYSTEM ====================

Table NotificationPreference {
  id varchar [primary key]
  userId varchar [unique, not null]

  // In-app preferences
  commentOnPost boolean [default: true]
  replyToComment boolean [default: true]
  mentionInComment boolean [default: true]
  reactionOnComment boolean [default: true]
  postPublished boolean [default: false]
  commentApproved boolean [default: true]
  commentFeatured boolean [default: true]
  moderationAction boolean [default: true]

  // Email preferences
  emailCommentOnPost boolean [default: true]
  emailReplyToComment boolean [default: true]
  emailMentionInComment boolean [default: true]
  emailPostPublished boolean [default: false]
  emailDigest boolean [default: false]
  emailDigestFrequency varchar [default: 'weekly']
  systemAnnouncement boolean [default: true]

  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]

  indexes {
    userId
  }
}

Table Notification {
  id varchar [primary key]
  userId varchar [not null]
  type NotificationType [not null]
  title varchar [not null]
  message text [not null]
  postId varchar
  commentId varchar
  reactionId varchar
  actorUserId varchar [note: 'User who triggered notification']
  actionUrl varchar
  metadata json
  isRead boolean [default: false]
  readAt timestamp
  isEmailSent boolean [default: false]
  emailSentAt timestamp
  groupKey varchar [note: 'For grouping similar notifications']
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  expiresAt timestamp

  indexes {
    (userId, isRead)
    (userId, createdAt)
    type
    groupKey
    expiresAt
    actorUserId
  }
}

// ==================== CONTENT ORGANIZATION ====================

Table Category {
  id varchar [primary key]
  name varchar [not null]
  slug varchar [unique, not null]
  description text
  parentId varchar
  metaTitle varchar
  metaDescription text
  iconUrl varchar
  orderPosition integer [default: 0]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]

  indexes {
    slug
    parentId
    orderPosition
  }
}

Table Tag {
  id varchar [primary key]
  name varchar [not null]
  slug varchar [unique, not null]
  description text
  metaTitle varchar
  metaDescription text
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]

  indexes {
    slug
    name
  }
}

// ==================== CONTENT MODELS ====================

Table Post {
  id varchar [primary key]
  authorId varchar [not null]
  categoryId varchar [not null]
  title varchar [not null]
  slug varchar [unique, not null]
  excerpt text
  content json [not null, note: 'Rich content in JSON format']
  featuredImageUrl varchar
  postType PostType [default: 'BLOG']
  status PostStatus [default: 'DRAFT']

  // SEO fields
  metaTitle varchar
  metaDescription text
  metaKeywords varchar
  ogImageUrl varchar
  canonicalUrl varchar
  schemaMarkup json

  // Metrics
  viewCount integer [default: 0]
  readingTime integer
  difficultyLevel DifficultyLevel

  // Timestamps
  publishedAt timestamp
  scheduledAt timestamp
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  deletedAt timestamp [note: 'Soft delete']

  indexes {
    slug
    status
    publishedAt
    categoryId
    authorId
    deletedAt
    postType
  }
}

Table PostTag {
  id varchar [primary key]
  postId varchar [not null]
  tagId varchar [not null]
  createdAt timestamp [default: `now()`]

  indexes {
    (postId, tagId) [unique]
    postId
    tagId
  }
}

// ==================== COMMENT SYSTEM ====================

Table Comment {
  id varchar [primary key]
  postId varchar [not null]
  userId varchar [note: 'Nullable for guest comments']
  parentId varchar [note: 'For threading']

  // Guest info
  authorName varchar
  authorEmail varchar
  authorUrl varchar

  // Content
  content json [not null]
  contentText text [not null, note: 'Plain text for search']
  wordCount integer [default: 0]

  // Status flags
  isFeatured boolean [default: false]
  isApproved boolean [default: false]
  isPinned boolean [default: false]
  isAuthorReply boolean [default: false]

  // Metrics
  helpfulCount integer [default: 0]
  likeCount integer [default: 0]
  replyCount integer [default: 0]

  // Moderation
  spamScore integer [default: 0]
  isEdited boolean [default: false]
  editedAt timestamp
  moderatedBy varchar
  moderatedAt timestamp

  // Tracking
  ipAddress varchar
  userAgent varchar
  referrer varchar

  // Timestamps
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  deletedAt timestamp

  indexes {
    postId
    userId
    parentId
    isApproved
    isFeatured
    createdAt
    deletedAt
  }
}

Table CommentReaction {
  id varchar [primary key]
  commentId varchar [not null]
  userId varchar
  reactionType ReactionType [not null]
  ipAddress varchar
  createdAt timestamp [default: `now()`]

  indexes {
    (commentId, userId, reactionType) [unique]
    (commentId, ipAddress, reactionType) [unique]
    commentId
    userId
  }
}

Table CommentMetadata {
  id varchar [primary key]
  commentId varchar [unique, not null]
  schemaType SchemaType [not null]
  upvoteCount integer [default: 0]
  downvoteCount integer [default: 0]
  bestAnswer boolean [default: false]
  authorReputationScore integer [default: 0]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]

  indexes {
    schemaType
  }
}

Table CommentMention {
  id varchar [primary key]
  commentId varchar [not null]
  mentionedUserId varchar [not null]
  position integer [not null, note: 'Character position in content']
  notified boolean [default: false]
  createdAt timestamp [default: `now()`]

  indexes {
    commentId
    mentionedUserId
    notified
  }
}

Table CommentLink {
  id varchar [primary key]
  commentId varchar [not null]
  url varchar [not null]
  anchorText varchar [not null]
  relAttribute varchar [default: 'nofollow ugc']
  isInternal boolean [default: false]
  clickCount integer [default: 0]
  createdAt timestamp [default: `now()`]

  indexes {
    commentId
    url
  }
}

// ==================== CONTENT SERIES ====================

Table PostSeries {
  id varchar [primary key]
  title varchar [not null]
  slug varchar [unique, not null]
  description text
  thumbnailUrl varchar
  metaTitle varchar
  metaDescription text
  orderPosition integer [default: 0]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]

  indexes {
    slug
    orderPosition
  }
}

Table PostSeriesItem {
  id varchar [primary key]
  seriesId varchar [not null]
  postId varchar [not null]
  orderPosition integer [not null]
  createdAt timestamp [default: `now()`]

  indexes {
    (seriesId, postId) [unique]
    seriesId
    postId
    orderPosition
  }
}

// ==================== MEDIA MANAGEMENT ====================

Table Media {
  id varchar [primary key]
  userId varchar [not null]
  fileName varchar [not null]
  filePath varchar [not null]
  fileUrl varchar [not null]
  mimeType varchar [not null]
  fileSize integer [not null]
  altText varchar
  caption text
  width integer
  height integer
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]

  indexes {
    userId
    mimeType
  }
}

// ==================== ANALYTICS ====================

Table PostView {
  id varchar [primary key]
  postId varchar [not null]
  userId varchar
  ipAddress varchar [not null]
  userAgent varchar
  referrer varchar
  viewedAt timestamp [default: `now()`]

  indexes {
    postId
    userId
    viewedAt
    ipAddress
  }
}

// ==================== SEO & REDIRECTS ====================

Table Redirect {
  id varchar [primary key]
  oldUrl varchar [unique, not null]
  newUrl varchar [not null]
  statusCode RedirectStatus [not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]

  indexes {
    oldUrl
  }
}

// ==================== AUDIT & LOGGING ====================

Table ActivityLog {
  id varchar [primary key]
  userId varchar
  action ActivityAction [not null]
  entity varchar [not null, note: 'Entity type (User, Post, Comment)']
  entityId varchar
  description varchar [not null]
  oldData json
  newData json
  ipAddress inet
  userAgent varchar
  method HttpMethod
  endpoint varchar
  success boolean [default: true]
  errorMessage text
  severity LogSeverity [default: 'INFO']
  duration integer [note: 'Execution time in ms']
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]

  indexes {
    (userId, createdAt)
    (entity, entityId)
    (action, createdAt)
    createdAt
    success
    (userId, action)
    (entity, action)
    severity
  }
}

// ==================== RELATIONSHIPS ====================

// Authentication
Ref: Account.userId > User.id [delete: cascade]

// Notifications
Ref: NotificationPreference.userId - User.id [delete: cascade]
Ref: Notification.userId > User.id [delete: cascade]

// Content Organization
Ref: Category.parentId > Category.id [delete: cascade]

// Content
Ref: Post.authorId > User.id [delete: cascade]
Ref: Post.categoryId > Category.id [delete: restrict]
Ref: PostTag.postId > Post.id [delete: cascade]
Ref: PostTag.tagId > Tag.id [delete: cascade]

// Comments
Ref: Comment.postId > Post.id [delete: cascade]
Ref: Comment.userId > User.id [delete: set null]
Ref: Comment.parentId > Comment.id [delete: cascade]
Ref: Comment.moderatedBy > User.id [delete: set null]
Ref: CommentReaction.commentId > Comment.id [delete: cascade]
Ref: CommentReaction.userId > User.id [delete: set null]
Ref: CommentMetadata.commentId - Comment.id [delete: cascade]
Ref: CommentMention.commentId > Comment.id [delete: cascade]
Ref: CommentMention.mentionedUserId > User.id [delete: cascade]
Ref: CommentLink.commentId > Comment.id [delete: cascade]

// Series
Ref: PostSeriesItem.seriesId > PostSeries.id [delete: cascade]
Ref: PostSeriesItem.postId > Post.id [delete: cascade]

// Media
Ref: Media.userId > User.id [delete: cascade]

// Analytics
Ref: PostView.postId > Post.id [delete: cascade]
Ref: PostView.userId > User.id [delete: set null]

// Audit
Ref: ActivityLog.userId > User.id [delete: cascade]
