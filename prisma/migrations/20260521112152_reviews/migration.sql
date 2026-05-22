-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "review_tourId_idx" ON "review"("tourId");

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
