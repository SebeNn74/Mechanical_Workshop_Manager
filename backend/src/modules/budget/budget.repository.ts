import prisma from '#/config/prisma.js';
import { generateMonthlyCode } from '#/shared/utils/code.generator.js';
import {
    Budget,
    CreateBudgetInput,
    UpdateBudgetInput,
    BudgetFilters,
} from './budget.types.js';

export interface IBudgetRepository {
    create(data: CreateBudgetInput): Promise<Budget>;
    existsById(id: number): Promise<boolean>;
    existsByReceptionId(receptionId: number): Promise<boolean>;
    findById(id: number): Promise<Budget | null>;
    findByReceptionId(receptionId: number): Promise<Budget | null>;
    findAll(filters: BudgetFilters): Promise<Budget[]>;
    update(id: number, data: UpdateBudgetInput): Promise<Budget>;
    delete(id: number): Promise<Budget>;
}

export class BudgetRepository implements IBudgetRepository {
    async create(data: CreateBudgetInput): Promise<Budget> {
        const budgetNumber = await generateMonthlyCode({
            prefix: 'PRS',
            tableName: 'budget',
            fieldName: 'budgetNumber',
        });
        return await prisma.budget.create({
            data: { ...data, budgetNumber },
        });
    }

    async existsById(id: number): Promise<boolean> {
        const exists = await prisma.budget.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!exists;
    }

    async existsByReceptionId(receptionId: number): Promise<boolean> {
        const exists = await prisma.budget.findUnique({
            where: { receptionId },
            select: { id: true },
        });
        return !!exists;
    }

    async findById(id: number): Promise<Budget | null> {
        return await prisma.budget.findUnique({
            where: { id },
        });
    }

    async findByReceptionId(receptionId: number): Promise<Budget | null> {
        return await prisma.budget.findUnique({
            where: { receptionId },
        });
    }

    async findAll(filters: BudgetFilters): Promise<Budget[]> {
        return await prisma.budget.findMany({
            where: { ...filters },
        });
    }

    async update(id: number, data: UpdateBudgetInput): Promise<Budget> {
        if (data.status === 'APPROVED') {
            return await prisma.budget.update({
                where: { id },
                data: { ...data, approvedAt: new Date() },
            });
        }
        if (data.status === 'REJECTED') {
            return await prisma.budget.update({
                where: { id },
                data: { ...data, approvedAt: null },
            });
        }
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
