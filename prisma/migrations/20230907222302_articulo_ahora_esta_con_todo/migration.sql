/*
  Warnings:

  - You are about to drop the column `id_image` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `id_text` on the `article` table. All the data in the column will be lost.
  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `text` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image_url` to the `article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `article` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "article" DROP CONSTRAINT "article_id_image_fkey";

-- DropForeignKey
ALTER TABLE "article" DROP CONSTRAINT "article_id_text_fkey";

-- AlterTable
ALTER TABLE "article" DROP COLUMN "id_image",
DROP COLUMN "id_text",
ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(250);

-- DropTable
DROP TABLE "image";

-- DropTable
DROP TABLE "text";
