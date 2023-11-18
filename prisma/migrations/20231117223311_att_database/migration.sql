/*
  Warnings:

  - You are about to drop the `_StreetToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hour_price` to the `parking_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_StreetToUser" DROP CONSTRAINT "_StreetToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_StreetToUser" DROP CONSTRAINT "_StreetToUser_B_fkey";

-- AlterTable
ALTER TABLE "parking_sessions" ADD COLUMN     "hour_price" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "hours" DROP NOT NULL,
ALTER COLUMN "total_price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "streets" ADD COLUMN     "hour_price" DOUBLE PRECISION NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "streetId" TEXT;

-- DropTable
DROP TABLE "_StreetToUser";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_streetId_fkey" FOREIGN KEY ("streetId") REFERENCES "streets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
