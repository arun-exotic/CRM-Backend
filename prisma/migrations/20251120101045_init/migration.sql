/*
  Warnings:

  - Added the required column `createdById` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Deal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
