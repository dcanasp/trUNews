/*
  Warnings:

  - Added the required column `weight` to the `trend_author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trend_author" ADD COLUMN     "weight" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "username" SET DATA TYPE TEXT,
ALTER COLUMN "profession" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "profession" SET DATA TYPE TEXT;
