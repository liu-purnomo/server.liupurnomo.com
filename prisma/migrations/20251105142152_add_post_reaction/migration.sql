-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "amazingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "helpfulCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "insightfulCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "loveCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PostReaction" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT,
    "reactionType" "ReactionType" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostReaction_postId_idx" ON "PostReaction"("postId");

-- CreateIndex
CREATE INDEX "PostReaction_userId_createdAt_idx" ON "PostReaction"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "PostReaction_reactionType_idx" ON "PostReaction"("reactionType");

-- CreateIndex
CREATE INDEX "PostReaction_postId_reactionType_idx" ON "PostReaction"("postId", "reactionType");

-- CreateIndex
CREATE UNIQUE INDEX "PostReaction_postId_userId_reactionType_key" ON "PostReaction"("postId", "userId", "reactionType");

-- CreateIndex
CREATE UNIQUE INDEX "PostReaction_postId_ipAddress_reactionType_key" ON "PostReaction"("postId", "ipAddress", "reactionType");

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
