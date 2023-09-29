-- CreateTable
CREATE TABLE "community" (
    "id_community" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "creator_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "community_pkey" PRIMARY KEY ("id_community")
);

-- CreateTable
CREATE TABLE "community_has_articles" (
    "article_id_community" INTEGER NOT NULL,
    "community_id_community" INTEGER NOT NULL,

    CONSTRAINT "community_has_articles_pkey" PRIMARY KEY ("community_id_community","article_id_community")
);

-- CreateTable
CREATE TABLE "community_has_users" (
    "users_id_community" INTEGER NOT NULL,
    "community_id_community" INTEGER NOT NULL,

    CONSTRAINT "community_has_users_pkey" PRIMARY KEY ("community_id_community","users_id_community")
);

-- CreateTable
CREATE TABLE "community_has_categories" (
    "categories_id_community" INTEGER NOT NULL,
    "community_id_community" INTEGER NOT NULL,

    CONSTRAINT "community_has_categories_pkey" PRIMARY KEY ("categories_id_community","community_id_community")
);

-- CreateTable
CREATE TABLE "community_has_participants" (
    "participants_id_community" INTEGER NOT NULL,
    "community_id_community" INTEGER NOT NULL,

    CONSTRAINT "community_has_participants_pkey" PRIMARY KEY ("participants_id_community","community_id_community")
);

-- AddForeignKey
ALTER TABLE "community" ADD CONSTRAINT "community_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_has_articles" ADD CONSTRAINT "community_has_articles_article_id_community_fkey" FOREIGN KEY ("article_id_community") REFERENCES "article"("id_article") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_has_articles" ADD CONSTRAINT "community_has_articles_community_id_community_fkey" FOREIGN KEY ("community_id_community") REFERENCES "community"("id_community") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_has_users" ADD CONSTRAINT "community_has_users_users_id_community_fkey" FOREIGN KEY ("users_id_community") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_has_users" ADD CONSTRAINT "community_has_users_community_id_community_fkey" FOREIGN KEY ("community_id_community") REFERENCES "community"("id_community") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_has_categories" ADD CONSTRAINT "community_has_categories_categories_id_community_fkey" FOREIGN KEY ("categories_id_community") REFERENCES "categories"("id_category") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_has_categories" ADD CONSTRAINT "community_has_categories_community_id_community_fkey" FOREIGN KEY ("community_id_community") REFERENCES "community"("id_community") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_has_participants" ADD CONSTRAINT "community_has_participants_community_id_community_fkey" FOREIGN KEY ("community_id_community") REFERENCES "community"("id_community") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_has_participants" ADD CONSTRAINT "community_has_participants_participants_id_community_fkey" FOREIGN KEY ("participants_id_community") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
