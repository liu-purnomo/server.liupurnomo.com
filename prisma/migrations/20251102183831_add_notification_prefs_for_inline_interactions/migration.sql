-- AlterTable
ALTER TABLE "NotificationPreference" ADD COLUMN     "emailHighlightOnPost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailInlineCommentOnPost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailNoteOnHighlight" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "highlightOnPost" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "inlineCommentOnPost" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mentionInHighlight" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mentionInInlineComment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "noteOnHighlight" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "reactionOnHighlight" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "reactionOnInlineComment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "replyToHighlightNote" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "replyToInlineComment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "shareHighlight" BOOLEAN NOT NULL DEFAULT false;
