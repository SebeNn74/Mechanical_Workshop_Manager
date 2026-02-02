import prisma from '#/config/prisma.js';
import {
    RepairTask,
    CreateRepairTaskInput,
    UpdateRepairTaskInput,
    RepairTaskFilters,
} from './repair-task.types.js';

export interface IRepairTaskRepository {
    create(data: CreateRepairTaskInput): Promise<RepairTask>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<RepairTask | null>;
    findAll(filters: RepairTaskFilters): Promise<RepairTask[]>;
    update(id: number, data: UpdateRepairTaskInput): Promise<RepairTask>;
    delete(id: number): Promise<RepairTask>;
}

export class RepairTaskRepository implements IRepairTaskRepository {
    async create(data: CreateRepairTaskInput): Promise<RepairTask> {
        return await prisma.repairTask.create({ data });
    }

    async existsById(id: number): Promise<boolean> {
        const exists = await prisma.repairTask.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!exists;
    }

    async findById(id: number): Promise<RepairTask | null> {
        return await prisma.repairTask.findUnique({
            where: { id },
        });
    }

    async findAll(filters: RepairTaskFilters): Promise<RepairTask[]> {
        return await prisma.repairTask.findMany({
            where: { ...filters },
        });
    }

    async update(id: number, data: UpdateRepairTaskInput): Promise<RepairTask> {
        return await prisma.repairTask.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<RepairTask> {
        return await prisma.repairTask.delete({
            where: { id },
        });
    }
}
