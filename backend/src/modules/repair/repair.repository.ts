import prisma from '#/config/prisma.js';
import {
    Repair,
    CreateRepairInput,
    UpdateRepairInput,
    RepairFilters,
} from './repair.types.js';

export interface IRepairRepository {
    create(data: CreateRepairInput): Promise<Repair>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<Repair | null>;
    findAll(filters: RepairFilters): Promise<Repair[]>;
    update(id: number, data: UpdateRepairInput): Promise<Repair>;
    delete(id: number): Promise<Repair>;
}

export class RepairRepository implements IRepairRepository {
    async create(data: CreateRepairInput): Promise<Repair> {
        return await prisma.repair.create({ data });
    }

    async existsById(id: number): Promise<boolean> {
        const exists = await prisma.repair.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!exists;
    }

    async findById(id: number): Promise<Repair | null> {
        return await prisma.repair.findUnique({
            where: { id },
        });
    }

    async findAll(filters: RepairFilters): Promise<Repair[]> {
        return await prisma.repair.findMany({
            where: { ...filters },
        });
    }

    async update(id: number, data: UpdateRepairInput): Promise<Repair> {
        return await prisma.repair.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Repair> {
        return await prisma.repair.delete({
            where: { id },
        });
    }
}
