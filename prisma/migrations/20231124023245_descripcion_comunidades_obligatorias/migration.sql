/*
  Warnings:

  - Made the column `description` on table `community` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "community" ALTER COLUMN "description" SET NOT NULL;
