import prisma from '#/config/prisma.js';
import {
    BudgetItem,
    CreateBudgetItemInput,
    UpdateBudgetItemInput,
    BudgetItemFilters,
    CreateBudgetItemBulkInput,
    UpdateBudgetItemBulkItem,
} from './budget_item.types.js';

export interface IBudgetItemRepository {
    create(data: CreateBudgetItemInput): Promise<BudgetItem>;
    createBulk(items: CreateBudgetItemBulkInput): Promise<BudgetItem[]>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<BudgetItem | null>;
    findAll(filters: BudgetItemFilters): Promise<BudgetItem[]>;
    update(id: number, data: UpdateBudgetItemInput): Promise<BudgetItem>;
    updateBulk(items: UpdateBudgetItemBulkItem[]): Promise<BudgetItem[]>;
    delete(id: number): Promise<BudgetItem>;
    deleteByBudgetId(budgetId: number): Promise<number>;
}

export class BudgetItemRepository implements IBudgetItemRepository {
    async create(data: CreateBudgetItemInput): Promise<BudgetItem> {
        return await prisma.budgetItem.create({ data });
    }

    async createBulk(items: CreateBudgetItemBulkInput): Promise<BudgetItem[]> {
        const createdItems = await prisma.$transaction(
            items.map((item) => prisma.budgetItem.create({ data: item })),
        );
        return createdItems;
    }

    async existsById(id: number): Promise<boolean> {
        const exists = await prisma.budgetItem.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!exists;
    }

    async findById(id: number): Promise<BudgetItem | null> {
        return await prisma.budgetItem.findUnique({
            where: { id },
        });
    }

    async findAll(filters: BudgetItemFilters): Promise<BudgetItem[]> {
        return await prisma.budgetItem.findMany({
            where: { ...filters },
        });
    }

    async update(id: number, data: UpdateBudgetItemInput): Promise<BudgetItem> {
        return await prisma.budgetItem.update({
            where: { id },
            data,
        });
    }

    async updateBulk(items: UpdateBudgetItemBulkItem[]): Promise<BudgetItem[]> {
        const updatedPhotos = await prisma.$transaction(
            items.map(({ id, data }) =>
                prisma.budgetItem.update({
                    where: { id },
                    data,
                }),
            ),
        );
        return updatedPhotos;
    }

    async delete(id: number): Promise<BudgetItem> {
        return await prisma.budgetItem.delete({
            where: { id },
        });
    }

    async deleteByBudgetId(budgetId: number): Promise<number> {
        const result = await prisma.budgetItem.deleteMany({
            where: { budgetId },
        });
        return result.count;
    }
}
