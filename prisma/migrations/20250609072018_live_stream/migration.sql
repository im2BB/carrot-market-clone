/*
  Warnings:

  - You are about to drop the column `stream_Id` on the `LiveStream` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `LiveStream` table. All the data in the column will be lost.
  - Added the required column `stream_id` to the `LiveStream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `LiveStream` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LiveStream" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "stream_key" TEXT NOT NULL,
    "stream_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "LiveStream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LiveStream" ("created_at", "id", "stream_key", "title", "userId") SELECT "created_at", "id", "stream_key", "title", "userId" FROM "LiveStream";
DROP TABLE "LiveStream";
ALTER TABLE "new_LiveStream" RENAME TO "LiveStream";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
