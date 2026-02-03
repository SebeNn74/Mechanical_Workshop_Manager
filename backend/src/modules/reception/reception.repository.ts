import prisma from '#/config/prisma.js';
import { generateMonthlyCode } from '#/shared/utils/code.generator.js';
import {
    Reception,
    CreateReceptionInput,
    UpdateReceptionInput,
    ReceptionFilters,
} from './reception.types.js';

export interface IReceptionRepository {
    create(data: CreateReceptionInput): Promise<Reception>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<Reception | null>;
    findAll(filters: ReceptionFilters): Promise<Reception[]>;
    update(id: number, data: UpdateReceptionInput): Promise<Reception>;
    delete(id: number): Promise<Reception>;
}

export class ReceptionRepository implements IReceptionRepository {
    async create(data: CreateReceptionInput): Promise<Reception> {
        const receptionNumber = await generateMonthlyCode({
            prefix: 'REC',
            tableName: 'reception',
            fieldName: 'receptionNumber',
        });
        return await prisma.reception.create({
            data: { ...data, receptionNumber },
        });
    }

    async existsById(id: number): Promise<boolean> {
        const exists = await prisma.reception.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!exists;
    }

    async findById(id: number): Promise<Reception | null> {
        return await prisma.reception.findUnique({
            where: { id },
        });
    }

    async findAll(filters: ReceptionFilters): Promise<Reception[]> {
        return await prisma.reception.findMany({
            where: { ...filters },
        });
    }

    async update(id: number, data: UpdateReceptionInput): Promise<Reception> {
        return await prisma.reception.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Reception> {
        return await prisma.reception.delete({
            where: { id },
        });
    }
}
