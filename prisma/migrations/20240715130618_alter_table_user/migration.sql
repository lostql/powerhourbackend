/*
  Warnings:

  - You are about to drop the column `appleId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `facebookId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `gmail` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `appleId` on the `userotp` table. All the data in the column will be lost.
  - You are about to drop the column `facebookId` on the `userotp` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `userotp` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `UserOtp_appleId_key` ON `userotp`;

-- DropIndex
DROP INDEX `UserOtp_facebookId_key` ON `userotp`;

-- DropIndex
DROP INDEX `UserOtp_googleId_key` ON `userotp`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `appleId`,
    DROP COLUMN `facebookId`,
    DROP COLUMN `gmail`;

-- AlterTable
ALTER TABLE `userotp` DROP COLUMN `appleId`,
    DROP COLUMN `facebookId`,
    DROP COLUMN `googleId`;
