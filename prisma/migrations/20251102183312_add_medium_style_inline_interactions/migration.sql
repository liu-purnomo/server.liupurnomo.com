-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'INLINE_COMMENT_ON_POST';
ALTER TYPE "NotificationType" ADD VALUE 'REPLY_TO_INLINE_COMMENT';
ALTER TYPE "NotificationType" ADD VALUE 'MENTION_IN_INLINE_COMMENT';
ALTER TYPE "NotificationType" ADD VALUE 'REACTION_ON_INLINE_COMMENT';
ALTER TYPE "NotificationType" ADD VALUE 'HIGHLIGHT_ON_POST';
ALTER TYPE "NotificationType" ADD VALUE 'NOTE_ON_HIGHLIGHT';
ALTER TYPE "NotificationType" ADD VALUE 'REPLY_TO_HIGHLIGHT_NOTE';
ALTER TYPE "NotificationType" ADD VALUE 'MENTION_IN_HIGHLIGHT';
ALTER TYPE "NotificationType" ADD VALUE 'REACTION_ON_HIGHLIGHT';
ALTER TYPE "NotificationType" ADD VALUE 'SHARE_HIGHLIGHT';

-- CreateTable
CREATE TABLE "InlineComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT,
    "guestName" TEXT,
    "guestEmail" TEXT,
    "startOffset" INTEGER NOT NULL,
    "endOffset" INTEGER NOT NULL,
    "selectedText" TEXT NOT NULL,
    "blockId" TEXT,
    "paragraphId" TEXT,
    "content" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "spamScore" INTEGER NOT NULL DEFAULT 0,
    "moderatedBy" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InlineComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InlineCommentReply" (
    "id" TEXT NOT NULL,
    "inlineCommentId" TEXT NOT NULL,
    "userId" TEXT,
    "parentReplyId" TEXT,
    "guestName" TEXT,
    "guestEmail" TEXT,
    "content" TEXT NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "spamScore" INTEGER NOT NULL DEFAULT 0,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InlineCommentReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InlineCommentReaction" (
    "id" TEXT NOT NULL,
    "inlineCommentId" TEXT NOT NULL,
    "userId" TEXT,
    "reactionType" "ReactionType" NOT NULL,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InlineCommentReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InlineCommentReplyReaction" (
    "id" TEXT NOT NULL,
    "inlineCommentReplyId" TEXT NOT NULL,
    "userId" TEXT,
    "reactionType" "ReactionType" NOT NULL,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InlineCommentReplyReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InlineCommentMention" (
    "id" TEXT NOT NULL,
    "inlineCommentId" TEXT NOT NULL,
    "mentionedUserId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InlineCommentMention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InlineCommentReplyMention" (
    "id" TEXT NOT NULL,
    "inlineCommentReplyId" TEXT NOT NULL,
    "mentionedUserId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InlineCommentReplyMention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParagraphReaction" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT,
    "blockId" TEXT,
    "paragraphId" TEXT,
    "startOffset" INTEGER,
    "endOffset" INTEGER,
    "reactionType" "ReactionType" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParagraphReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Highlight" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startOffset" INTEGER NOT NULL,
    "endOffset" INTEGER NOT NULL,
    "selectedText" TEXT NOT NULL,
    "blockId" TEXT,
    "paragraphId" TEXT,
    "color" TEXT NOT NULL DEFAULT '#FFEB3B',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "noteCount" INTEGER NOT NULL DEFAULT 0,
    "reactionCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "moderatedBy" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HighlightNote" (
    "id" TEXT NOT NULL,
    "highlightId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "spamScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "HighlightNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HighlightReaction" (
    "id" TEXT NOT NULL,
    "highlightId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reactionType" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HighlightReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HighlightNoteReaction" (
    "id" TEXT NOT NULL,
    "highlightNoteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reactionType" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HighlightNoteReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HighlightShare" (
    "id" TEXT NOT NULL,
    "highlightId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "shareUrl" TEXT,
    "shareText" TEXT,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HighlightShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HighlightMention" (
    "id" TEXT NOT NULL,
    "highlightId" TEXT NOT NULL,
    "mentionedUserId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HighlightMention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HighlightNoteMention" (
    "id" TEXT NOT NULL,
    "highlightNoteId" TEXT NOT NULL,
    "mentionedUserId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HighlightNoteMention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HighlightCollection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "iconEmoji" TEXT,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HighlightCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HighlightCollectionItem" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "highlightId" TEXT NOT NULL,
    "note" TEXT,
    "orderPosition" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HighlightCollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InlineComment_postId_isPublic_deletedAt_idx" ON "InlineComment"("postId", "isPublic", "deletedAt");

-- CreateIndex
CREATE INDEX "InlineComment_postId_blockId_deletedAt_idx" ON "InlineComment"("postId", "blockId", "deletedAt");

-- CreateIndex
CREATE INDEX "InlineComment_postId_paragraphId_deletedAt_idx" ON "InlineComment"("postId", "paragraphId", "deletedAt");

-- CreateIndex
CREATE INDEX "InlineComment_userId_createdAt_idx" ON "InlineComment"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "InlineComment_deletedAt_idx" ON "InlineComment"("deletedAt");

-- CreateIndex
CREATE INDEX "InlineComment_isResolved_idx" ON "InlineComment"("isResolved");

-- CreateIndex
CREATE INDEX "InlineComment_isApproved_isHidden_idx" ON "InlineComment"("isApproved", "isHidden");

-- CreateIndex
CREATE INDEX "InlineComment_reportCount_idx" ON "InlineComment"("reportCount");

-- CreateIndex
CREATE INDEX "InlineCommentReply_inlineCommentId_createdAt_idx" ON "InlineCommentReply"("inlineCommentId", "createdAt");

-- CreateIndex
CREATE INDEX "InlineCommentReply_userId_idx" ON "InlineCommentReply"("userId");

-- CreateIndex
CREATE INDEX "InlineCommentReply_parentReplyId_idx" ON "InlineCommentReply"("parentReplyId");

-- CreateIndex
CREATE INDEX "InlineCommentReply_deletedAt_idx" ON "InlineCommentReply"("deletedAt");

-- CreateIndex
CREATE INDEX "InlineCommentReply_isHidden_idx" ON "InlineCommentReply"("isHidden");

-- CreateIndex
CREATE INDEX "InlineCommentReaction_inlineCommentId_idx" ON "InlineCommentReaction"("inlineCommentId");

-- CreateIndex
CREATE INDEX "InlineCommentReaction_userId_idx" ON "InlineCommentReaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InlineCommentReaction_inlineCommentId_userId_reactionType_key" ON "InlineCommentReaction"("inlineCommentId", "userId", "reactionType");

-- CreateIndex
CREATE UNIQUE INDEX "InlineCommentReaction_inlineCommentId_ipAddress_reactionTyp_key" ON "InlineCommentReaction"("inlineCommentId", "ipAddress", "reactionType");

-- CreateIndex
CREATE INDEX "InlineCommentReplyReaction_inlineCommentReplyId_idx" ON "InlineCommentReplyReaction"("inlineCommentReplyId");

-- CreateIndex
CREATE INDEX "InlineCommentReplyReaction_userId_idx" ON "InlineCommentReplyReaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InlineCommentReplyReaction_inlineCommentReplyId_userId_reac_key" ON "InlineCommentReplyReaction"("inlineCommentReplyId", "userId", "reactionType");

-- CreateIndex
CREATE UNIQUE INDEX "InlineCommentReplyReaction_inlineCommentReplyId_ipAddress_r_key" ON "InlineCommentReplyReaction"("inlineCommentReplyId", "ipAddress", "reactionType");

-- CreateIndex
CREATE INDEX "InlineCommentMention_inlineCommentId_idx" ON "InlineCommentMention"("inlineCommentId");

-- CreateIndex
CREATE INDEX "InlineCommentMention_mentionedUserId_idx" ON "InlineCommentMention"("mentionedUserId");

-- CreateIndex
CREATE INDEX "InlineCommentMention_notified_idx" ON "InlineCommentMention"("notified");

-- CreateIndex
CREATE INDEX "InlineCommentReplyMention_inlineCommentReplyId_idx" ON "InlineCommentReplyMention"("inlineCommentReplyId");

-- CreateIndex
CREATE INDEX "InlineCommentReplyMention_mentionedUserId_idx" ON "InlineCommentReplyMention"("mentionedUserId");

-- CreateIndex
CREATE INDEX "InlineCommentReplyMention_notified_idx" ON "InlineCommentReplyMention"("notified");

-- CreateIndex
CREATE INDEX "ParagraphReaction_postId_blockId_idx" ON "ParagraphReaction"("postId", "blockId");

-- CreateIndex
CREATE INDEX "ParagraphReaction_postId_paragraphId_idx" ON "ParagraphReaction"("postId", "paragraphId");

-- CreateIndex
CREATE INDEX "ParagraphReaction_userId_createdAt_idx" ON "ParagraphReaction"("userId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ParagraphReaction_postId_userId_blockId_paragraphId_reactio_key" ON "ParagraphReaction"("postId", "userId", "blockId", "paragraphId", "reactionType");

-- CreateIndex
CREATE UNIQUE INDEX "ParagraphReaction_postId_ipAddress_blockId_paragraphId_reac_key" ON "ParagraphReaction"("postId", "ipAddress", "blockId", "paragraphId", "reactionType");

-- CreateIndex
CREATE INDEX "Highlight_postId_userId_deletedAt_idx" ON "Highlight"("postId", "userId", "deletedAt");

-- CreateIndex
CREATE INDEX "Highlight_postId_isPublic_deletedAt_idx" ON "Highlight"("postId", "isPublic", "deletedAt");

-- CreateIndex
CREATE INDEX "Highlight_userId_createdAt_idx" ON "Highlight"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Highlight_userId_isPublic_deletedAt_idx" ON "Highlight"("userId", "isPublic", "deletedAt");

-- CreateIndex
CREATE INDEX "Highlight_isPublic_createdAt_idx" ON "Highlight"("isPublic", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Highlight_blockId_isPublic_idx" ON "Highlight"("blockId", "isPublic");

-- CreateIndex
CREATE INDEX "Highlight_deletedAt_idx" ON "Highlight"("deletedAt");

-- CreateIndex
CREATE INDEX "Highlight_isHidden_idx" ON "Highlight"("isHidden");

-- CreateIndex
CREATE INDEX "Highlight_reportCount_idx" ON "Highlight"("reportCount");

-- CreateIndex
CREATE INDEX "HighlightNote_highlightId_createdAt_idx" ON "HighlightNote"("highlightId", "createdAt");

-- CreateIndex
CREATE INDEX "HighlightNote_highlightId_deletedAt_idx" ON "HighlightNote"("highlightId", "deletedAt");

-- CreateIndex
CREATE INDEX "HighlightNote_userId_createdAt_idx" ON "HighlightNote"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "HighlightNote_parentId_idx" ON "HighlightNote"("parentId");

-- CreateIndex
CREATE INDEX "HighlightNote_deletedAt_idx" ON "HighlightNote"("deletedAt");

-- CreateIndex
CREATE INDEX "HighlightNote_isHidden_idx" ON "HighlightNote"("isHidden");

-- CreateIndex
CREATE INDEX "HighlightReaction_highlightId_idx" ON "HighlightReaction"("highlightId");

-- CreateIndex
CREATE INDEX "HighlightReaction_userId_idx" ON "HighlightReaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HighlightReaction_highlightId_userId_reactionType_key" ON "HighlightReaction"("highlightId", "userId", "reactionType");

-- CreateIndex
CREATE INDEX "HighlightNoteReaction_highlightNoteId_idx" ON "HighlightNoteReaction"("highlightNoteId");

-- CreateIndex
CREATE INDEX "HighlightNoteReaction_userId_idx" ON "HighlightNoteReaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HighlightNoteReaction_highlightNoteId_userId_reactionType_key" ON "HighlightNoteReaction"("highlightNoteId", "userId", "reactionType");

-- CreateIndex
CREATE INDEX "HighlightShare_highlightId_idx" ON "HighlightShare"("highlightId");

-- CreateIndex
CREATE INDEX "HighlightShare_userId_sharedAt_idx" ON "HighlightShare"("userId", "sharedAt" DESC);

-- CreateIndex
CREATE INDEX "HighlightShare_platform_idx" ON "HighlightShare"("platform");

-- CreateIndex
CREATE INDEX "HighlightShare_sharedAt_idx" ON "HighlightShare"("sharedAt" DESC);

-- CreateIndex
CREATE INDEX "HighlightMention_highlightId_idx" ON "HighlightMention"("highlightId");

-- CreateIndex
CREATE INDEX "HighlightMention_mentionedUserId_idx" ON "HighlightMention"("mentionedUserId");

-- CreateIndex
CREATE INDEX "HighlightMention_notified_idx" ON "HighlightMention"("notified");

-- CreateIndex
CREATE INDEX "HighlightNoteMention_highlightNoteId_idx" ON "HighlightNoteMention"("highlightNoteId");

-- CreateIndex
CREATE INDEX "HighlightNoteMention_mentionedUserId_idx" ON "HighlightNoteMention"("mentionedUserId");

-- CreateIndex
CREATE INDEX "HighlightNoteMention_notified_idx" ON "HighlightNoteMention"("notified");

-- CreateIndex
CREATE INDEX "HighlightCollection_userId_createdAt_idx" ON "HighlightCollection"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "HighlightCollection_isPublic_viewCount_idx" ON "HighlightCollection"("isPublic", "viewCount" DESC);

-- CreateIndex
CREATE INDEX "HighlightCollection_isPublic_createdAt_idx" ON "HighlightCollection"("isPublic", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "HighlightCollection_userId_slug_key" ON "HighlightCollection"("userId", "slug");

-- CreateIndex
CREATE INDEX "HighlightCollectionItem_collectionId_orderPosition_idx" ON "HighlightCollectionItem"("collectionId", "orderPosition");

-- CreateIndex
CREATE INDEX "HighlightCollectionItem_highlightId_idx" ON "HighlightCollectionItem"("highlightId");

-- CreateIndex
CREATE INDEX "HighlightCollectionItem_collectionId_createdAt_idx" ON "HighlightCollectionItem"("collectionId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "HighlightCollectionItem_collectionId_highlightId_key" ON "HighlightCollectionItem"("collectionId", "highlightId");

-- AddForeignKey
ALTER TABLE "InlineComment" ADD CONSTRAINT "InlineComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineComment" ADD CONSTRAINT "InlineComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineComment" ADD CONSTRAINT "InlineComment_moderatedBy_fkey" FOREIGN KEY ("moderatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineCommentReply" ADD CONSTRAINT "InlineCommentReply_inlineCommentId_fkey" FOREIGN KEY ("inlineCommentId") REFERENCES "InlineComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineCommentReply" ADD CONSTRAINT "InlineCommentReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineCommentReply" ADD CONSTRAINT "InlineCommentReply_parentReplyId_fkey" FOREIGN KEY ("parentReplyId") REFERENCES "InlineCommentReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineCommentReaction" ADD CONSTRAINT "InlineCommentReaction_inlineCommentId_fkey" FOREIGN KEY ("inlineCommentId") REFERENCES "InlineComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineCommentReaction" ADD CONSTRAINT "InlineCommentReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineCommentReplyReaction" ADD CONSTRAINT "InlineCommentReplyReaction_inlineCommentReplyId_fkey" FOREIGN KEY ("inlineCommentReplyId") REFERENCES "InlineCommentReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineCommentReplyReaction" ADD CONSTRAINT "InlineCommentReplyReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineCommentMention" ADD CONSTRAINT "InlineCommentMention_inlineCommentId_fkey" FOREIGN KEY ("inlineCommentId") REFERENCES "InlineComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineCommentMention" ADD CONSTRAINT "InlineCommentMention_mentionedUserId_fkey" FOREIGN KEY ("mentionedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineCommentReplyMention" ADD CONSTRAINT "InlineCommentReplyMention_inlineCommentReplyId_fkey" FOREIGN KEY ("inlineCommentReplyId") REFERENCES "InlineCommentReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineCommentReplyMention" ADD CONSTRAINT "InlineCommentReplyMention_mentionedUserId_fkey" FOREIGN KEY ("mentionedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParagraphReaction" ADD CONSTRAINT "ParagraphReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParagraphReaction" ADD CONSTRAINT "ParagraphReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_moderatedBy_fkey" FOREIGN KEY ("moderatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightNote" ADD CONSTRAINT "HighlightNote_highlightId_fkey" FOREIGN KEY ("highlightId") REFERENCES "Highlight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightNote" ADD CONSTRAINT "HighlightNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightNote" ADD CONSTRAINT "HighlightNote_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "HighlightNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightReaction" ADD CONSTRAINT "HighlightReaction_highlightId_fkey" FOREIGN KEY ("highlightId") REFERENCES "Highlight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightReaction" ADD CONSTRAINT "HighlightReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightNoteReaction" ADD CONSTRAINT "HighlightNoteReaction_highlightNoteId_fkey" FOREIGN KEY ("highlightNoteId") REFERENCES "HighlightNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightNoteReaction" ADD CONSTRAINT "HighlightNoteReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightShare" ADD CONSTRAINT "HighlightShare_highlightId_fkey" FOREIGN KEY ("highlightId") REFERENCES "Highlight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightShare" ADD CONSTRAINT "HighlightShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightMention" ADD CONSTRAINT "HighlightMention_highlightId_fkey" FOREIGN KEY ("highlightId") REFERENCES "Highlight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightMention" ADD CONSTRAINT "HighlightMention_mentionedUserId_fkey" FOREIGN KEY ("mentionedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightNoteMention" ADD CONSTRAINT "HighlightNoteMention_highlightNoteId_fkey" FOREIGN KEY ("highlightNoteId") REFERENCES "HighlightNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightNoteMention" ADD CONSTRAINT "HighlightNoteMention_mentionedUserId_fkey" FOREIGN KEY ("mentionedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightCollection" ADD CONSTRAINT "HighlightCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightCollectionItem" ADD CONSTRAINT "HighlightCollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "HighlightCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightCollectionItem" ADD CONSTRAINT "HighlightCollectionItem_highlightId_fkey" FOREIGN KEY ("highlightId") REFERENCES "Highlight"("id") ON DELETE CASCADE ON UPDATE CASCADE;
