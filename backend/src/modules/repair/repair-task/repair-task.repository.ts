import prisma from '#/config/prisma.js';
import {
    RepairTask,
    CreateRepairTaskInput,
    UpdateRepairTaskInput,
    RepairTaskFilters,
    UpdateRepairTaskBulkItem,
    CreateRepairTaskBulkInput,
} from './repair-task.types.js';

export interface IRepairTaskRepository {
    create(data: CreateRepairTaskInput): Promise<RepairTask>;
    createBulk(tasks: CreateRepairTaskBulkInput): Promise<RepairTask[]>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<RepairTask | null>;
    findAll(filters: RepairTaskFilters): Promise<RepairTask[]>;
    update(id: number, data: UpdateRepairTaskInput): Promise<RepairTask>;
    updateBulk(tasks: UpdateRepairTaskBulkItem[]): Promise<RepairTask[]>;
    delete(id: number): Promise<RepairTask>;
    deleteByRepairId(repairId: number): Promise<number>;
}

export class RepairTaskRepository implements IRepairTaskRepository {
    async create(data: CreateRepairTaskInput): Promise<RepairTask> {
        return await prisma.repairTask.create({ data });
    }

    async createBulk(tasks: CreateRepairTaskBulkInput): Promise<RepairTask[]> {
        const createdTasks = await prisma.$transaction(
            tasks.map((task) => prisma.repairTask.create({ data: task })),
        );
        return createdTasks;
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

    async updateBulk(tasks: UpdateRepairTaskBulkItem[]): Promise<RepairTask[]> {
        const updatedRepairTasks = await prisma.$transaction(
            tasks.map(({ id, data }) =>
                prisma.repairTask.update({
                    where: { id },
                    data,
                }),
            ),
        );
        return updatedRepairTasks;
    }

    async delete(id: number): Promise<RepairTask> {
        return await prisma.repairTask.delete({
            where: { id },
        });
    }

    async deleteByRepairId(repairId: number): Promise<number> {
        const result = await prisma.repairTask.deleteMany({
            where: { repairId },
        });
        return result.count;
    }
}
