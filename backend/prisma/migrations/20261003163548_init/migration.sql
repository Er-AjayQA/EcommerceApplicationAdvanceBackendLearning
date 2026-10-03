/*
  Warnings:

  - A unique constraint covering the columns `[userId,addressType]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_addressType_key" ON "Address"("userId", "addressType");
