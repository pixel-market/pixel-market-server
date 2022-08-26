-- CreateEnum
CREATE TYPE "E_ProductType" AS ENUM ('SINGLE', 'VARIATIVE');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "type" "E_ProductType" NOT NULL DEFAULT 'SINGLE';
