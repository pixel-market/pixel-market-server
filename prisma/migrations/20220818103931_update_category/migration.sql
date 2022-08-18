/*
  Warnings:

  - You are about to drop the column `parentCatagoryId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentCatagoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "parentCatagoryId",
ADD COLUMN     "parentCategoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "Category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
