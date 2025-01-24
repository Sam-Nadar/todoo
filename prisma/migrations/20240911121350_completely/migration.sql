/*
  Warnings:

  - You are about to drop the column `todoListId` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the `TodoHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TodoList` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_todoListId_fkey";

-- DropForeignKey
ALTER TABLE "TodoHistory" DROP CONSTRAINT "TodoHistory_todoId_fkey";

-- DropForeignKey
ALTER TABLE "TodoList" DROP CONSTRAINT "TodoList_userId_fkey";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "todoListId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "TodoHistory";

-- DropTable
DROP TABLE "TodoList";

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
