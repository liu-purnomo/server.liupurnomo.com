-- DropIndex
DROP INDEX "public"."PostReaction_postId_ipAddress_reactionType_key";

-- DropIndex
DROP INDEX "public"."PostReaction_postId_userId_reactionType_key";

-- CreateIndex
CREATE INDEX "PostReaction_postId_userId_reactionType_idx" ON "PostReaction"("postId", "userId", "reactionType");

-- CreateIndex
CREATE INDEX "PostReaction_postId_ipAddress_userId_idx" ON "PostReaction"("postId", "ipAddress", "userId");
