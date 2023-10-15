-- DropForeignKey
ALTER TABLE "follower" DROP CONSTRAINT "follower_id_follower_fkey";

-- DropForeignKey
ALTER TABLE "follower" DROP CONSTRAINT "follower_id_following_fkey";

-- DropForeignKey
ALTER TABLE "saved" DROP CONSTRAINT "saved_id_article_fkey";

-- DropForeignKey
ALTER TABLE "saved" DROP CONSTRAINT "saved_id_user_fkey";

-- AddForeignKey
ALTER TABLE "follower" ADD CONSTRAINT "follower_id_follower_fkey" FOREIGN KEY ("id_follower") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follower" ADD CONSTRAINT "follower_id_following_fkey" FOREIGN KEY ("id_following") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved" ADD CONSTRAINT "saved_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved" ADD CONSTRAINT "saved_id_article_fkey" FOREIGN KEY ("id_article") REFERENCES "article"("id_article") ON DELETE CASCADE ON UPDATE CASCADE;
