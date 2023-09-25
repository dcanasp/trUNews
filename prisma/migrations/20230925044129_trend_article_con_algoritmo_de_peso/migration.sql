/*
  Warnings:

  - You are about to drop the column `base` on the `trend_article` table. All the data in the column will be lost.
  - Added the required column `image_url` to the `trend_article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `views` to the `trend_article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `trend_article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trend_article" DROP COLUMN "base",
ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL,
ADD COLUMN     "weight" DECIMAL(65,30) NOT NULL;
