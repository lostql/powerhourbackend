/*
  Warnings:

  - You are about to drop the `userachievement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `userachievement` DROP FOREIGN KEY `UserAchievement_achievementId_fkey`;

-- DropForeignKey
ALTER TABLE `userachievement` DROP FOREIGN KEY `UserAchievement_userId_fkey`;

-- DropTable
DROP TABLE `userachievement`;
