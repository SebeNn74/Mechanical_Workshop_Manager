import prisma from '#/config/prisma.js';
import {
    Photo,
    CreatePhotoInput,
    UpdatePhotoInput,
    PhotoFilters,
} from './photo.types.js';

export interface IPhotoRepository {
    create(data: CreatePhotoInput): Promise<Photo>;
    existsById(id: number): Promise<boolean>;
    findById(id: number): Promise<Photo | null>;
    findAll(filters: PhotoFilters): Promise<Photo[]>;
    update(id: number, data: UpdatePhotoInput): Promise<Photo>;
    delete(id: number): Promise<Photo>;
}

export class PhotoRepository implements IPhotoRepository {
    async create(data: CreatePhotoInput): Promise<Photo> {
        return await prisma.photo.create({ data });
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

    async delete(id: number): Promise<Photo> {
        return await prisma.photo.delete({
            where: { id },
        });
    }
}
