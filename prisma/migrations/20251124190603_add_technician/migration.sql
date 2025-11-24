-- AlterTable
ALTER TABLE "asset_movements" ADD COLUMN     "technicianId" TEXT,
ALTER COLUMN "toLocation" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "asset_movements" ADD CONSTRAINT "asset_movements_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
