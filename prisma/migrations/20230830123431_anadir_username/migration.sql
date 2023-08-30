-- CreateTable
CREATE TABLE "users" (
    "id_users" SERIAL NOT NULL,
    "username" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT,
    "hash" TEXT NOT NULL,
    "rol" DECIMAL NOT NULL,
    "profession" TEXT,
    "description" TEXT,

    CONSTRAINT "pk_users" PRIMARY KEY ("id_users")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
