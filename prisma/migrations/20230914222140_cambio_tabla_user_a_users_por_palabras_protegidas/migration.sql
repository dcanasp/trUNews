/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "article" DROP CONSTRAINT "article_id_writer_fkey";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id_user" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "hash" TEXT NOT NULL,
    "lastname" VARCHAR(45) NOT NULL,
    "rol" INTEGER NOT NULL,
    "profession" VARCHAR(45),
    "description" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_id_writer_fkey" FOREIGN KEY ("id_writer") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
