/*
  Warnings:

  - Added the required column `threshold` to the `Achievement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `achievement` ADD COLUMN `threshold` INTEGER NOT NULL,
    MODIFY `points` INTEGER NOT NULL DEFAULT 0;
