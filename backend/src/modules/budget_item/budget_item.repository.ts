import prisma from '#/config/prisma.js';
import {
    BudgetItem,
    CreateBudgetItemInput,
    UpdateBudgetItemInput,
    BudgetItemFilters,
} from './budget_item.types.js';

export interface IBudgetItemRepository {
    create(data: CreateBudgetItemInput): Promise<BudgetItem>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<BudgetItem | null>;
    findAll(filters: BudgetItemFilters): Promise<BudgetItem[]>;
    update(id: number, data: UpdateBudgetItemInput): Promise<BudgetItem>;
    delete(id: number): Promise<BudgetItem>;
}

export class BudgetItemRepository implements IBudgetItemRepository {
    async create(data: CreateBudgetItemInput): Promise<BudgetItem> {
        return await prisma.budgetItem.create({ data });
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

    async delete(id: number): Promise<BudgetItem> {
        return await prisma.budgetItem.delete({
            where: { id },
        });
    }
}
