-- DropForeignKey
ALTER TABLE "Resident" DROP CONSTRAINT "Resident_householdId_fkey";

-- AlterTable
ALTER TABLE "Resident" ALTER COLUMN "householdId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE SET NULL ON UPDATE CASCADE;
