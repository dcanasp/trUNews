/*
  Warnings:

  - You are about to drop the `community_has_participants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "community_has_participants" DROP CONSTRAINT "community_has_participants_community_id_community_fkey";

-- DropForeignKey
ALTER TABLE "community_has_participants" DROP CONSTRAINT "community_has_participants_participants_id_community_fkey";

-- DropTable
DROP TABLE "community_has_participants";
