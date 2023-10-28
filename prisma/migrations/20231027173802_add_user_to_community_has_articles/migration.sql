/*
  Warnings:

  - The primary key for the `community_has_articles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `users_id_community` to the `community_has_articles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "community_has_articles" DROP CONSTRAINT "community_has_articles_pkey",
ADD COLUMN     "users_id_community" INTEGER NOT NULL,
ADD CONSTRAINT "community_has_articles_pkey" PRIMARY KEY ("community_id_community", "article_id_community", "users_id_community");

-- AddForeignKey
ALTER TABLE "community_has_articles" ADD CONSTRAINT "community_has_articles_users_id_community_fkey" FOREIGN KEY ("users_id_community") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
