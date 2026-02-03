import prisma from '#/config/prisma.js';
import {
    ChecklistItem,
    CreateChecklistItInput,
    UpdateChecklistItInput,
    ChecklistItFilters,
    CreateChecklistItBulkInput,
    UpdateChecklistItBulkItem,
} from './checklist_item.types.js';

export interface IChecklistItRepository {
    create(data: CreateChecklistItInput): Promise<ChecklistItem>;
    createBulk(items: CreateChecklistItBulkInput): Promise<ChecklistItem[]>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<ChecklistItem | null>;
    findAll(filters: ChecklistItFilters): Promise<ChecklistItem[]>;
    update(id: number, data: UpdateChecklistItInput): Promise<ChecklistItem>;
    updateBulk(items: UpdateChecklistItBulkItem[]): Promise<ChecklistItem[]>;
    delete(id: number): Promise<ChecklistItem>;
    deleteByReceptionId(receptionId: number): Promise<number>;
}

export class ChecklistItRepository implements IChecklistItRepository {
    async create(data: CreateChecklistItInput): Promise<ChecklistItem> {
        return await prisma.checklistItem.create({ data });
    }

    async createBulk(items: CreateChecklistItBulkInput): Promise<ChecklistItem[]> {
        const createdItems = await prisma.$transaction(
            items.map((item) =>
                prisma.checklistItem.create({ data: item }),
            ),
        );
        return createdItems;
    }

    async existsById(id: number): Promise<boolean> {
        const exists = await prisma.checklistItem.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!exists;
    }

    async findById(id: number): Promise<ChecklistItem | null> {
        return await prisma.checklistItem.findUnique({
            where: { id },
        });
    }

    async findAll(filters: ChecklistItFilters): Promise<ChecklistItem[]> {
        return await prisma.checklistItem.findMany({
            where: { ...filters },
        });
    }

    async update(
        id: number,
        data: UpdateChecklistItInput,
    ): Promise<ChecklistItem> {
        return await prisma.checklistItem.update({
            where: { id },
            data,
        });
    }

    async updateBulk(items: UpdateChecklistItBulkItem[]): Promise<ChecklistItem[]> {
        const updatedItems = await prisma.$transaction(
            items.map(({ id, data }) =>
                prisma.checklistItem.update({
                    where: { id },
                    data,
                }),
            ),
        );
        return updatedItems;
    }

    async delete(id: number): Promise<ChecklistItem> {
        return await prisma.checklistItem.delete({
            where: { id },
        });
    }

    async deleteByReceptionId(receptionId: number): Promise<number> {
        const result = await prisma.checklistItem.deleteMany({
            where: { receptionId },
        });
        return result.count;
    }

}
