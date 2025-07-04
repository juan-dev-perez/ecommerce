/*
  Warnings:

  - You are about to drop the column `productId` on the `Category` table. All the data in the column will be lost.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_productId_fkey";

-- DropIndex
DROP INDEX "Category_productId_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT NOT NULL;
