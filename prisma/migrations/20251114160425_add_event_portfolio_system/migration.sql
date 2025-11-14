-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WORKSHOP', 'TRAINING', 'SEMINAR', 'CONFERENCE', 'MEETUP', 'WEBINAR', 'HACKATHON', 'TALK', 'OTHER');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventLocationType" AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID');

-- CreateEnum
CREATE TYPE "PostReactionType" AS ENUM ('LIKE', 'HELPFUL', 'LOVE', 'INSIGHTFUL', 'AMAZING');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "content" JSONB,
    "eventType" "EventType" NOT NULL DEFAULT 'OTHER',
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "locationType" "EventLocationType" NOT NULL DEFAULT 'OFFLINE',
    "eventDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    "venue" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT DEFAULT 'Indonesia',
    "mapUrl" TEXT,
    "platformName" TEXT,
    "platformUrl" TEXT,
    "organizerName" TEXT,
    "organizerUrl" TEXT,
    "role" TEXT,
    "topics" TEXT[],
    "participants" INTEGER,
    "featuredImageUrl" TEXT,
    "galleryImages" TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[],
    "ogImageUrl" TEXT,
    "canonicalUrl" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_slug_idx" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_status_eventDate_idx" ON "Event"("status", "eventDate" DESC);

-- CreateIndex
CREATE INDEX "Event_eventType_status_idx" ON "Event"("eventType", "status");

-- CreateIndex
CREATE INDEX "Event_status_publishedAt_idx" ON "Event"("status", "publishedAt" DESC);

-- CreateIndex
CREATE INDEX "Event_city_status_idx" ON "Event"("city", "status");

-- CreateIndex
CREATE INDEX "Event_createdAt_idx" ON "Event"("createdAt" DESC);
