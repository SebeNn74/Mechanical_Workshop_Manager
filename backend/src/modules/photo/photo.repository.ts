import prisma from '#/config/prisma.js';
import {
    Photo,
    CreatePhotoInput,
    UpdatePhotoInput,
    PhotoFilters,
    CreatePhotoBulkInput,
    UpdatePhotoBulkItem,
} from './photo.types.js';

export interface IPhotoRepository {
    create(data: CreatePhotoInput): Promise<Photo>;
    createBulk(items: CreatePhotoBulkInput): Promise<Photo[]>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<Photo | null>;
    findAll(filters: PhotoFilters): Promise<Photo[]>;
    update(id: number, data: UpdatePhotoInput): Promise<Photo>;
    updateBulk(items: UpdatePhotoBulkItem[]): Promise<Photo[]>;
    delete(id: number): Promise<Photo>;
    deleteByChecklistItemId(checklistItemId: number): Promise<number>;
}

export class PhotoRepository implements IPhotoRepository {
    async create(data: CreatePhotoInput): Promise<Photo> {
        return await prisma.photo.create({ data });
    }

    async createBulk(items: CreatePhotoBulkInput): Promise<Photo[]> {
        const createdPhotos = await prisma.$transaction(
            items.map((item) => prisma.photo.create({ data: item })),
        );
        return createdPhotos;
    }

    async existsById(id: number): Promise<boolean> {
        const exists = await prisma.photo.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!exists;
    }

    async findById(id: number): Promise<Photo | null> {
        return await prisma.photo.findUnique({
            where: { id },
        });
    }

    async findAll(filters: PhotoFilters): Promise<Photo[]> {
        return await prisma.photo.findMany({
            where: { ...filters },
        });
    }

    async update(id: number, data: UpdatePhotoInput): Promise<Photo> {
        return await prisma.photo.update({
            where: { id },
            data,
        });
    }

    async updateBulk(items: UpdatePhotoBulkItem[]): Promise<Photo[]> {
        const updatedPhotos = await prisma.$transaction(
            items.map(({ id, data }) =>
                prisma.photo.update({
                    where: { id },
                    data,
                }),
            ),
        );
        return updatedPhotos;
    }

    async delete(id: number): Promise<Photo> {
        return await prisma.photo.delete({
            where: { id },
        });
    }

    async deleteByChecklistItemId(checklistItemId: number): Promise<number> {
        const result = await prisma.photo.deleteMany({
            where: { checklistItemId },
        });
        return result.count;
    }
}
