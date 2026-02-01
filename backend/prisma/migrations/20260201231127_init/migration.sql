/*
  Warnings:

  - You are about to drop the column `vehiclesId` on the `Reception` table. All the data in the column will be lost.
  - Added the required column `vehicleId` to the `Reception` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reception" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "vehicleId" INTEGER NOT NULL,
    CONSTRAINT "Reception_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reception" ("dateTime", "id", "notes") SELECT "dateTime", "id", "notes" FROM "Reception";
DROP TABLE "Reception";
ALTER TABLE "new_Reception" RENAME TO "Reception";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
