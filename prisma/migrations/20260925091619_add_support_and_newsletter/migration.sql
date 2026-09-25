-- CreateTable
CREATE TABLE "support_message" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "support_message_userId_idx" ON "support_message"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscriber_email_key" ON "newsletter_subscriber"("email");

-- AddForeignKey
ALTER TABLE "support_message" ADD CONSTRAINT "support_message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
