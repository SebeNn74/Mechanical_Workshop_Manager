import {
    Photo,
    CreatePhotoInput,
    UpdatePhotoInput,
    PhotoResponse,
    PhotoFilters,
    photoToResponseDTO,
    photosToArrayResDTO,
} from './photo.types.js';

import { IPhotoRepository } from './photo.repository.js';
import { NotFoundError } from '#/shared/errors/domain.error.js';

export interface IPhotoService {
    add(budget: CreatePhotoInput): Promise<PhotoResponse>;
    existsById(id: number): Promise<boolean>;
    getById(id: number): Promise<PhotoResponse>;
    getAll(filters: PhotoFilters): Promise<PhotoResponse[]>;
    update(id: number, data: UpdatePhotoInput): Promise<PhotoResponse>;
    delete(id: number): Promise<void>;
}

export class PhotoService implements IPhotoService {
    constructor(private readonly photoRepo: IPhotoRepository) {}

    async add(photo: CreatePhotoInput): Promise<PhotoResponse> {
        // Crear Photo
        const newPhoto = await this.photoRepo.create(photo);
        return photoToResponseDTO(newPhoto);
    }

    async existsById(id: number): Promise<boolean> {
        return this.photoRepo.existsById(id);
    }

    async getById(id: number): Promise<PhotoResponse> {
        const photo = await this.getPhotoOrFail(id);
        return photoToResponseDTO(photo);
    }

    async getAll(filters: PhotoFilters): Promise<PhotoResponse[]> {
        return photosToArrayResDTO(await this.photoRepo.findAll(filters));
    }

    async update(id: number, data: UpdatePhotoInput): Promise<PhotoResponse> {
        // 1. Verificar id
        await this.getPhotoOrFail(id);
        // 2. Actualizar Photo
        const updated = await this.photoRepo.update(id, data);
        return photoToResponseDTO(updated);
    }

    async delete(id: number): Promise<void> {
        // 1. Verificar id
        await this.getPhotoOrFail(id);
        // 2. Eliminar Photo
        await this.photoRepo.delete(id);
    }

    private async getPhotoOrFail(id: number): Promise<Photo> {
        const photo = await this.photoRepo.findById(id);
        if (!photo)
            throw new NotFoundError('El photo con el id solicitado no existe');
        return photo;
    }
}
