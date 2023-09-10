-- DropForeignKey
ALTER TABLE "article" DROP CONSTRAINT "article_id_writer_fkey";

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_id_writer_fkey" FOREIGN KEY ("id_writer") REFERENCES "user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
