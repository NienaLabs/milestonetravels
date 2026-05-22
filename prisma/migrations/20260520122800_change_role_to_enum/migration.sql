-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- Convert legacy lowercase values to uppercase before casting
UPDATE "user" SET "role" = 'USER' WHERE "role" = 'user';
UPDATE "user" SET "role" = 'ADMIN' WHERE "role" = 'admin';
UPDATE "user" SET "role" = 'USER' WHERE "role" IS NULL OR "role" NOT IN ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role" USING ("role"::text::"Role");
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER';
