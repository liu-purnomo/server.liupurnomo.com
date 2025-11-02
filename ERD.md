// ==================== LIU PURNOMO BLOG ERD ====================
// Database Schema for Liu Purnomo Blog with Advanced Features
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
  // Inline comment notifications
  INLINE_COMMENT_ON_POST
  REPLY_TO_INLINE_COMMENT
  MENTION_IN_INLINE_COMMENT
  REACTION_ON_INLINE_COMMENT
  // Highlight notifications
  HIGHLIGHT_ON_POST
  NOTE_ON_HIGHLIGHT
  REPLY_TO_HIGHLIGHT_NOTE
  MENTION_IN_HIGHLIGHT
  REACTION_ON_HIGHLIGHT
  SHARE_HIGHLIGHT
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

  // In-app preferences - Comments
  commentOnPost boolean [default: true]
  replyToComment boolean [default: true]
  mentionInComment boolean [default: true]
  reactionOnComment boolean [default: true]
  commentApproved boolean [default: true]
  commentFeatured boolean [default: true]

  // In-app preferences - Inline Comments
  inlineCommentOnPost boolean [default: true]
  replyToInlineComment boolean [default: true]
  mentionInInlineComment boolean [default: true]
  reactionOnInlineComment boolean [default: true]

  // In-app preferences - Highlights
  highlightOnPost boolean [default: true]
  noteOnHighlight boolean [default: true]
  replyToHighlightNote boolean [default: true]
  mentionInHighlight boolean [default: true]
  reactionOnHighlight boolean [default: true]
  shareHighlight boolean [default: false]

  // In-app preferences - General
  postPublished boolean [default: false]
  moderationAction boolean [default: true]

  // Email preferences - Comments
  emailCommentOnPost boolean [default: true]
  emailReplyToComment boolean [default: true]
  emailMentionInComment boolean [default: true]

  // Email preferences - Inline Comments & Highlights
  emailInlineCommentOnPost boolean [default: false]
  emailHighlightOnPost boolean [default: false]
  emailNoteOnHighlight boolean [default: false]

  // Email preferences - General
  emailPostPublished boolean [default: false]
  emailDigest boolean [default: false]
  emailDigestFrequency varchar [default: 'weekly']

  // System notifications
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

Table Bookmark {
  id varchar [primary key]
  userId varchar [not null]
  postId varchar [not null]
  note text [note: 'Personal note about bookmark']
  tags varchar[] [note: 'Custom tags for organizing']
  isFavorite boolean [default: false]
  isRead boolean [default: false]
  readAt timestamp
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]

  indexes {
    (userId, postId) [unique]
    (userId, createdAt)
    (userId, isFavorite)
    (userId, isRead)
    postId
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

// ==================== INLINE INTERACTION SYSTEM ====================

Table InlineComment {
  id varchar [primary key]
  postId varchar [not null]
  userId varchar [note: 'Nullable for guest comments']
  guestName varchar
  guestEmail varchar
  startOffset integer [not null, note: 'Character position start']
  endOffset integer [not null, note: 'Character position end']
  selectedText text [not null, note: 'Selected text for context']
  blockId varchar [note: 'Reference to content block']
  paragraphId varchar [note: 'Reference to paragraph element']
  content text [not null, note: 'Comment content']
  isPublic boolean [default: true]
  isResolved boolean [default: false]
  isApproved boolean [default: true]
  likeCount integer [default: 0]
  replyCount integer [default: 0]
  isEdited boolean [default: false]
  editedAt timestamp
  reportCount integer [default: 0]
  isHidden boolean [default: false]
  spamScore integer [default: 0]
  moderatedBy varchar
  moderatedAt timestamp
  ipAddress varchar
  userAgent varchar
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  deletedAt timestamp [note: 'Soft delete']

  indexes {
    (postId, isPublic, deletedAt)
    (postId, blockId, deletedAt)
    (postId, paragraphId, deletedAt)
    (userId, createdAt)
    deletedAt
    isResolved
    (isApproved, isHidden)
    reportCount
  }
}

Table InlineCommentReply {
  id varchar [primary key]
  inlineCommentId varchar [not null]
  userId varchar [note: 'Nullable for guest replies']
  parentReplyId varchar [note: 'For nested replies']
  guestName varchar
  guestEmail varchar
  content text [not null]
  likeCount integer [default: 0]
  isEdited boolean [default: false]
  editedAt timestamp
  reportCount integer [default: 0]
  isHidden boolean [default: false]
  spamScore integer [default: 0]
  ipAddress varchar
  userAgent varchar
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  deletedAt timestamp

  indexes {
    (inlineCommentId, createdAt)
    userId
    parentReplyId
    deletedAt
    isHidden
  }
}

Table InlineCommentReaction {
  id varchar [primary key]
  inlineCommentId varchar [not null]
  userId varchar
  reactionType ReactionType [not null]
  ipAddress varchar
  createdAt timestamp [default: `now()`]

  indexes {
    (inlineCommentId, userId, reactionType) [unique]
    (inlineCommentId, ipAddress, reactionType) [unique]
    inlineCommentId
    userId
  }
}

Table InlineCommentReplyReaction {
  id varchar [primary key]
  inlineCommentReplyId varchar [not null]
  userId varchar
  reactionType ReactionType [not null]
  ipAddress varchar
  createdAt timestamp [default: `now()`]

  indexes {
    (inlineCommentReplyId, userId, reactionType) [unique]
    (inlineCommentReplyId, ipAddress, reactionType) [unique]
    inlineCommentReplyId
    userId
  }
}

Table InlineCommentMention {
  id varchar [primary key]
  inlineCommentId varchar [not null]
  mentionedUserId varchar [not null]
  position integer [not null]
  notified boolean [default: false]
  createdAt timestamp [default: `now()`]

  indexes {
    inlineCommentId
    mentionedUserId
    notified
  }
}

Table InlineCommentReplyMention {
  id varchar [primary key]
  inlineCommentReplyId varchar [not null]
  mentionedUserId varchar [not null]
  position integer [not null]
  notified boolean [default: false]
  createdAt timestamp [default: `now()`]

  indexes {
    inlineCommentReplyId
    mentionedUserId
    notified
  }
}

// ==================== PARAGRAPH REACTION SYSTEM ====================

Table ParagraphReaction {
  id varchar [primary key]
  postId varchar [not null]
  userId varchar [note: 'Nullable for guest reactions']
  blockId varchar [note: 'Reference to content block']
  paragraphId varchar [note: 'Reference to paragraph element']
  startOffset integer [note: 'Optional text range start']
  endOffset integer [note: 'Optional text range end']
  reactionType ReactionType [not null]
  ipAddress varchar
  userAgent varchar
  createdAt timestamp [default: `now()`]

  indexes {
    (postId, userId, blockId, paragraphId, reactionType) [unique]
    (postId, ipAddress, blockId, paragraphId, reactionType) [unique]
    (postId, blockId)
    (postId, paragraphId)
    (userId, createdAt)
  }
}

// ==================== HIGHLIGHT SYSTEM ====================

Table Highlight {
  id varchar [primary key]
  postId varchar [not null]
  userId varchar [not null]
  startOffset integer [not null]
  endOffset integer [not null]
  selectedText text [not null]
  blockId varchar
  paragraphId varchar
  color varchar [default: '#FFEB3B', note: 'Highlight color']
  isPublic boolean [default: true]
  isShared boolean [default: false]
  noteCount integer [default: 0]
  reactionCount integer [default: 0]
  shareCount integer [default: 0]
  reportCount integer [default: 0]
  isHidden boolean [default: false]
  moderatedBy varchar
  moderatedAt timestamp
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  deletedAt timestamp

  indexes {
    (postId, userId, deletedAt)
    (postId, isPublic, deletedAt)
    (userId, createdAt)
    (userId, isPublic, deletedAt)
    (isPublic, createdAt)
    (blockId, isPublic)
    deletedAt
    isHidden
    reportCount
  }
}

Table HighlightNote {
  id varchar [primary key]
  highlightId varchar [not null]
  userId varchar [not null]
  parentId varchar [note: 'For threaded replies']
  content text [not null]
  likeCount integer [default: 0]
  replyCount integer [default: 0]
  isEdited boolean [default: false]
  editedAt timestamp
  reportCount integer [default: 0]
  isHidden boolean [default: false]
  spamScore integer [default: 0]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  deletedAt timestamp

  indexes {
    (highlightId, createdAt)
    (highlightId, deletedAt)
    (userId, createdAt)
    parentId
    deletedAt
    isHidden
  }
}

Table HighlightReaction {
  id varchar [primary key]
  highlightId varchar [not null]
  userId varchar [not null]
  reactionType ReactionType [not null]
  createdAt timestamp [default: `now()`]

  indexes {
    (highlightId, userId, reactionType) [unique]
    highlightId
    userId
  }
}

Table HighlightNoteReaction {
  id varchar [primary key]
  highlightNoteId varchar [not null]
  userId varchar [not null]
  reactionType ReactionType [not null]
  createdAt timestamp [default: `now()`]

  indexes {
    (highlightNoteId, userId, reactionType) [unique]
    highlightNoteId
    userId
  }
}

Table HighlightShare {
  id varchar [primary key]
  highlightId varchar [not null]
  userId varchar [not null]
  platform varchar [not null, note: 'twitter, facebook, linkedin, etc']
  shareUrl varchar
  shareText text
  clickCount integer [default: 0]
  ipAddress varchar
  userAgent varchar
  sharedAt timestamp [default: `now()`]

  indexes {
    highlightId
    (userId, sharedAt)
    platform
    sharedAt
  }
}

Table HighlightMention {
  id varchar [primary key]
  highlightId varchar [not null]
  mentionedUserId varchar [not null]
  position integer [not null]
  notified boolean [default: false]
  createdAt timestamp [default: `now()`]

  indexes {
    highlightId
    mentionedUserId
    notified
  }
}

Table HighlightNoteMention {
  id varchar [primary key]
  highlightNoteId varchar [not null]
  mentionedUserId varchar [not null]
  position integer [not null]
  notified boolean [default: false]
  createdAt timestamp [default: `now()`]

  indexes {
    highlightNoteId
    mentionedUserId
    notified
  }
}

// ==================== HIGHLIGHT COLLECTIONS ====================

Table HighlightCollection {
  id varchar [primary key]
  userId varchar [not null]
  name varchar [not null]
  slug varchar [not null]
  description text
  isPublic boolean [default: false]
  color varchar [default: '#3B82F6']
  iconEmoji varchar
  itemCount integer [default: 0]
  viewCount integer [default: 0]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]

  indexes {
    (userId, slug) [unique]
    (userId, createdAt)
    (isPublic, viewCount)
    (isPublic, createdAt)
  }
}

Table HighlightCollectionItem {
  id varchar [primary key]
  collectionId varchar [not null]
  highlightId varchar [not null]
  note text
  orderPosition integer [default: 0]
  createdAt timestamp [default: `now()`]

  indexes {
    (collectionId, highlightId) [unique]
    (collectionId, orderPosition)
    highlightId
    (collectionId, createdAt)
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
Ref: Bookmark.userId > User.id [delete: cascade]
Ref: Bookmark.postId > Post.id [delete: cascade]

// Audit
Ref: ActivityLog.userId > User.id [delete: cascade]

// Inline Comments
Ref: InlineComment.postId > Post.id [delete: cascade]
Ref: InlineComment.userId > User.id [delete: set null]
Ref: InlineComment.moderatedBy > User.id [delete: set null]
Ref: InlineCommentReply.inlineCommentId > InlineComment.id [delete: cascade]
Ref: InlineCommentReply.userId > User.id [delete: set null]
Ref: InlineCommentReply.parentReplyId > InlineCommentReply.id [delete: cascade]
Ref: InlineCommentReaction.inlineCommentId > InlineComment.id [delete: cascade]
Ref: InlineCommentReaction.userId > User.id [delete: set null]
Ref: InlineCommentReplyReaction.inlineCommentReplyId > InlineCommentReply.id [delete: cascade]
Ref: InlineCommentReplyReaction.userId > User.id [delete: set null]
Ref: InlineCommentMention.inlineCommentId > InlineComment.id [delete: cascade]
Ref: InlineCommentMention.mentionedUserId > User.id [delete: cascade]
Ref: InlineCommentReplyMention.inlineCommentReplyId > InlineCommentReply.id [delete: cascade]
Ref: InlineCommentReplyMention.mentionedUserId > User.id [delete: cascade]

// Paragraph Reactions
Ref: ParagraphReaction.postId > Post.id [delete: cascade]
Ref: ParagraphReaction.userId > User.id [delete: set null]

// Highlights
Ref: Highlight.postId > Post.id [delete: cascade]
Ref: Highlight.userId > User.id [delete: cascade]
Ref: Highlight.moderatedBy > User.id [delete: set null]
Ref: HighlightNote.highlightId > Highlight.id [delete: cascade]
Ref: HighlightNote.userId > User.id [delete: cascade]
Ref: HighlightNote.parentId > HighlightNote.id [delete: cascade]
Ref: HighlightReaction.highlightId > Highlight.id [delete: cascade]
Ref: HighlightReaction.userId > User.id [delete: cascade]
Ref: HighlightNoteReaction.highlightNoteId > HighlightNote.id [delete: cascade]
Ref: HighlightNoteReaction.userId > User.id [delete: cascade]
Ref: HighlightShare.highlightId > Highlight.id [delete: cascade]
Ref: HighlightShare.userId > User.id [delete: cascade]
Ref: HighlightMention.highlightId > Highlight.id [delete: cascade]
Ref: HighlightMention.mentionedUserId > User.id [delete: cascade]
Ref: HighlightNoteMention.highlightNoteId > HighlightNote.id [delete: cascade]
Ref: HighlightNoteMention.mentionedUserId > User.id [delete: cascade]

// Highlight Collections
Ref: HighlightCollection.userId > User.id [delete: cascade]
Ref: HighlightCollectionItem.collectionId > HighlightCollection.id [delete: cascade]
Ref: HighlightCollectionItem.highlightId > Highlight.id [delete: cascade]
