/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "article" (
    "id_article" SERIAL NOT NULL,
    "id_writer" INTEGER NOT NULL,
    "id_text" INTEGER NOT NULL,
    "id_image" INTEGER NOT NULL,
    "title" VARCHAR(45) NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id_article")
);

-- CreateTable
CREATE TABLE "article_has_categories" (
    "articles_id_article" INTEGER NOT NULL,
    "categories_id_categories" INTEGER NOT NULL,

    CONSTRAINT "article_has_categories_pkey" PRIMARY KEY ("articles_id_article","categories_id_categories")
);

-- CreateTable
CREATE TABLE "categories" (
    "id_category" SERIAL NOT NULL,
    "cat_name" VARCHAR(45) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id_category")
);

-- CreateTable
CREATE TABLE "follower" (
    "id_follower" INTEGER NOT NULL,
    "id_following" INTEGER NOT NULL,

    CONSTRAINT "follower_pkey" PRIMARY KEY ("id_follower","id_following")
);

-- CreateTable
CREATE TABLE "image" (
    "id_image" SERIAL NOT NULL,
    "base" TEXT NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id_image")
);

-- CreateTable
CREATE TABLE "saved" (
    "id_user" INTEGER NOT NULL,
    "id_article" INTEGER NOT NULL,
    "date" VARCHAR(45) NOT NULL,

    CONSTRAINT "saved_pkey" PRIMARY KEY ("id_user","id_article")
);

-- CreateTable
CREATE TABLE "text" (
    "id_text" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "text_pkey" PRIMARY KEY ("id_text")
);

-- CreateTable
CREATE TABLE "trend_article" (
    "articles_id_article" INTEGER NOT NULL,
    "title" VARCHAR(45) NOT NULL,
    "base" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "author" VARCHAR(45) NOT NULL,

    CONSTRAINT "trend_article_pkey" PRIMARY KEY ("articles_id_article")
);

-- CreateTable
CREATE TABLE "trend_author" (
    "users_id_user" INTEGER NOT NULL,
    "username" VARCHAR(45) NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "lastname" VARCHAR(45) NOT NULL,
    "profession" VARCHAR(45) NOT NULL,

    CONSTRAINT "trend_author_pkey" PRIMARY KEY ("users_id_user")
);

-- CreateTable
CREATE TABLE "user" (
    "id_user" SERIAL NOT NULL,
    "username" VARCHAR(45) NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "hash" VARCHAR(45) NOT NULL,
    "lastname" VARCHAR(45) NOT NULL,
    "rol" INTEGER NOT NULL,
    "profession" VARCHAR(45),
    "description" VARCHAR(150),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_cat_name_key" ON "categories"("cat_name");

-- CreateIndex
CREATE UNIQUE INDEX "trend_author_username_key" ON "trend_author"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_id_writer_fkey" FOREIGN KEY ("id_writer") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_id_text_fkey" FOREIGN KEY ("id_text") REFERENCES "text"("id_text") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_id_image_fkey" FOREIGN KEY ("id_image") REFERENCES "image"("id_image") ON DELETE RESTRICT ON UPDATE CASCADE;
