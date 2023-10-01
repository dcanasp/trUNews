/*
  Warnings:

  - You are about to drop the `Saved` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Saved" DROP CONSTRAINT "Saved_id_article_fkey";

-- DropForeignKey
ALTER TABLE "Saved" DROP CONSTRAINT "Saved_id_user_fkey";

-- DropTable
DROP TABLE "Saved";

-- CreateTable
CREATE TABLE "saved" (
    "id_user" INTEGER NOT NULL,
    "id_article" INTEGER NOT NULL,
    "date" VARCHAR(45) NOT NULL,

    CONSTRAINT "saved_pkey" PRIMARY KEY ("id_user","id_article")
);

-- AddForeignKey
ALTER TABLE "article_has_categories" ADD CONSTRAINT "article_has_categories_categories_id_categories_fkey" FOREIGN KEY ("categories_id_categories") REFERENCES "categories"("id_category") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved" ADD CONSTRAINT "saved_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved" ADD CONSTRAINT "saved_id_article_fkey" FOREIGN KEY ("id_article") REFERENCES "article"("id_article") ON DELETE RESTRICT ON UPDATE CASCADE;
