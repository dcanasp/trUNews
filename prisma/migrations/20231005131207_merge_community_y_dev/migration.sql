/*
  Warnings:

  - Added the required column `avatar_url` to the `community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `banner_url` to the `community` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "community" ADD COLUMN     "avatar_url" TEXT NOT NULL,
ADD COLUMN     "banner_url" TEXT NOT NULL;
