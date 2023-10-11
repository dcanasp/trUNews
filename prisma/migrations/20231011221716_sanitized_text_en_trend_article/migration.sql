/*
  Warnings:

  - Added the required column `sanitizedText` to the `trend_article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trend_article" ADD COLUMN     "sanitizedText" TEXT NOT NULL;
