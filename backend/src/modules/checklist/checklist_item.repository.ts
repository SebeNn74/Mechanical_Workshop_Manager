import prisma from '#/config/prisma.js';
import {
    ChecklistItem,
    CreateChecklistItInput,
    UpdateChecklistItInput,
    ChecklistItFilters,
} from './checklist_item.types.js';

export interface IChecklistItRepository {
    create(data: CreateChecklistItInput): Promise<ChecklistItem>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<ChecklistItem | null>;
    findAll(filters: ChecklistItFilters): Promise<ChecklistItem[]>;
    update(id: number, data: UpdateChecklistItInput): Promise<ChecklistItem>;
    delete(id: number): Promise<ChecklistItem>;
}

export class ChecklistItRepository implements IChecklistItRepository {
    async create(data: CreateChecklistItInput): Promise<ChecklistItem> {
        return await prisma.checklistItem.create({ data });
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

    async delete(id: number): Promise<ChecklistItem> {
        return await prisma.checklistItem.delete({
            where: { id },
        });
    }
}
