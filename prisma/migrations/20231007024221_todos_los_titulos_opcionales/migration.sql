-- AlterTable
ALTER TABLE "article" ALTER COLUMN "title" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "trend_article" ALTER COLUMN "title" DROP NOT NULL;
