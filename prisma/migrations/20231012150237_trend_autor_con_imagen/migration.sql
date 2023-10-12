/*
  Warnings:

  - Added the required column `profile_image` to the `trend_author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trend_author" ADD COLUMN     "profile_image" TEXT NOT NULL;
