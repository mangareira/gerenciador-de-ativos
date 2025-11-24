/*
  Warnings:

  - Added the required column `type` to the `asset_movements` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssetMovementType" AS ENUM ('allocation', 'maintenance', 'transfer', 'creation');

-- AlterTable
ALTER TABLE "asset_movements" ADD COLUMN     "type" "AssetMovementType" NOT NULL;
