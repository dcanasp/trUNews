-- AddForeignKey
ALTER TABLE "article_has_categories" ADD CONSTRAINT "article_has_categories_articles_id_article_fkey" FOREIGN KEY ("articles_id_article") REFERENCES "article"("id_article") ON DELETE CASCADE ON UPDATE CASCADE;
