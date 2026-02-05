-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "documentType" TEXT NOT NULL DEFAULT 'CC',
    "documentNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plateType" TEXT NOT NULL DEFAULT 'PRIVATE',
    "plate" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" INTEGER NOT NULL,
    CONSTRAINT "Vehicle_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChecklistTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "vehicleType" TEXT
);

-- CreateTable
CREATE TABLE "ChecklistTemplateItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "block" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL,
    CONSTRAINT "ChecklistTemplateItem_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ChecklistTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reception" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "receptionNumber" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mileageAtEntry" INTEGER NOT NULL,
    "notes" TEXT,
    "vehicleId" INTEGER NOT NULL,
    CONSTRAINT "Reception_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "block" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_CHECKED',
    "notes" TEXT,
    "receptionId" INTEGER NOT NULL,
    CONSTRAINT "ChecklistItem_receptionId_fkey" FOREIGN KEY ("receptionId") REFERENCES "Reception" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "checklistItemId" INTEGER NOT NULL,
    CONSTRAINT "Photo_checklistItemId_fkey" FOREIGN KEY ("checklistItemId") REFERENCES "ChecklistItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "budgetNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" DATETIME,
    "receptionId" INTEGER NOT NULL,
    CONSTRAINT "Budget_receptionId_fkey" FOREIGN KEY ("receptionId") REFERENCES "Reception" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "estimatedPrice" INTEGER NOT NULL,
    "budgetId" INTEGER NOT NULL,
    CONSTRAINT "BudgetItem_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Repair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repairNumber" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "notes" TEXT,
    "receptionId" INTEGER NOT NULL,
    CONSTRAINT "Repair_receptionId_fkey" FOREIGN KEY ("receptionId") REFERENCES "Reception" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RepairTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "finalPrice" INTEGER NOT NULL,
    "repairId" INTEGER NOT NULL,
    "budgetItemId" INTEGER NOT NULL,
    CONSTRAINT "RepairTask_repairId_fkey" FOREIGN KEY ("repairId") REFERENCES "Repair" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RepairTask_budgetItemId_fkey" FOREIGN KEY ("budgetItemId") REFERENCES "BudgetItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Client_documentNumber_idx" ON "Client"("documentNumber");

-- CreateIndex
CREATE INDEX "Client_name_idx" ON "Client"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Client_documentType_documentNumber_key" ON "Client"("documentType", "documentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "Vehicle"("plate");

-- CreateIndex
CREATE INDEX "Vehicle_clientId_idx" ON "Vehicle"("clientId");

-- CreateIndex
CREATE INDEX "Vehicle_plate_idx" ON "Vehicle"("plate");

-- CreateIndex
CREATE INDEX "ChecklistTemplateItem_templateId_idx" ON "ChecklistTemplateItem"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "Reception_receptionNumber_key" ON "Reception"("receptionNumber");

-- CreateIndex
CREATE INDEX "Reception_vehicleId_idx" ON "Reception"("vehicleId");

-- CreateIndex
CREATE INDEX "Reception_receptionNumber_idx" ON "Reception"("receptionNumber");

-- CreateIndex
CREATE INDEX "Reception_dateTime_idx" ON "Reception"("dateTime");

-- CreateIndex
CREATE INDEX "ChecklistItem_receptionId_idx" ON "ChecklistItem"("receptionId");

-- CreateIndex
CREATE INDEX "Photo_checklistItemId_idx" ON "Photo"("checklistItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_budgetNumber_key" ON "Budget"("budgetNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_receptionId_key" ON "Budget"("receptionId");

-- CreateIndex
CREATE INDEX "Budget_budgetNumber_idx" ON "Budget"("budgetNumber");

-- CreateIndex
CREATE INDEX "Budget_status_idx" ON "Budget"("status");

-- CreateIndex
CREATE INDEX "BudgetItem_budgetId_idx" ON "BudgetItem"("budgetId");

-- CreateIndex
CREATE UNIQUE INDEX "Repair_repairNumber_key" ON "Repair"("repairNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Repair_receptionId_key" ON "Repair"("receptionId");

-- CreateIndex
CREATE INDEX "Repair_repairNumber_idx" ON "Repair"("repairNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RepairTask_budgetItemId_key" ON "RepairTask"("budgetItemId");

-- CreateIndex
CREATE INDEX "RepairTask_repairId_idx" ON "RepairTask"("repairId");
