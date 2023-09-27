/*
  Warnings:

  - You are about to drop the `saved` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "saved";

-- CreateTable
CREATE TABLE "Saved" (
    "id_user" INTEGER NOT NULL,
    "id_article" INTEGER NOT NULL,
    "date" VARCHAR(45) NOT NULL,

    CONSTRAINT "Saved_pkey" PRIMARY KEY ("id_user","id_article")
);

-- AddForeignKey
ALTER TABLE "follower" ADD CONSTRAINT "follower_id_follower_fkey" FOREIGN KEY ("id_follower") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follower" ADD CONSTRAINT "follower_id_following_fkey" FOREIGN KEY ("id_following") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_id_article_fkey" FOREIGN KEY ("id_article") REFERENCES "article"("id_article") ON DELETE RESTRICT ON UPDATE CASCADE;
