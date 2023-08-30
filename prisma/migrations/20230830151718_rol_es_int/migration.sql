/*
  Warnings:

  - You are about to alter the column `rol` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Integer`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "rol" SET DATA TYPE INTEGER;
