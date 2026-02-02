import prisma from '#/config/prisma.js';
import {
    Budget,
    CreateBudgetInput,
    UpdateBudgetInput,
    BudgetFilters,
} from './budget.types.js';

export interface IBudgetRepository {
    create(data: CreateBudgetInput): Promise<Budget>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<Budget | null>;
    findAll(filters: BudgetFilters): Promise<Budget[]>;
    update(id: number, data: UpdateBudgetInput): Promise<Budget>;
    delete(id: number): Promise<Budget>;
}

export class BudgetRepository implements IBudgetRepository {
    async create(data: CreateBudgetInput): Promise<Budget> {
        return await prisma.budget.create({ data });
    }

    async existsById(id: number): Promise<boolean> {
        const exists = await prisma.budget.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!exists;
    }

    async findById(id: number): Promise<Budget | null> {
        return await prisma.budget.findUnique({
            where: { id },
        });
    }

    async findAll(filters: BudgetFilters): Promise<Budget[]> {
        return await prisma.budget.findMany({
            where: { ...filters },
        });
    }

    async update(id: number, data: UpdateBudgetInput): Promise<Budget> {
        return await prisma.budget.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Budget> {
        return await prisma.budget.delete({
            where: { id },
        });
    }
}
